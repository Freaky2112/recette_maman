#!/usr/bin/env python3
"""Valide le nom et la structure des recettes (_posts/**/*.md).

Usage :
  python scripts/validate_recipes.py                 # toutes les recettes
  python scripts/validate_recipes.py _posts/a.md ... # fichiers précis
"""
import datetime
import os
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
FILENAME_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$")
REQUIRED = ["layout", "title", "category", "date", "ingredients", "steps"]
OPTIONAL = ["description", "emoji", "prep_time", "cook_time", "servings",
            "difficulty", "tags", "image", "notes"]
DIFFICULTES = {"facile", "moyen", "difficile"}
ON_GITHUB = os.environ.get("GITHUB_ACTIONS") == "true"


class UniqueKeyLoader(yaml.SafeLoader):
    """Refuse les clés en double (ex. deux 'ingredients:')."""

    def construct_mapping(self, node, deep=False):
        seen = set()
        for key_node, _ in node.value:
            key = self.construct_object(key_node, deep=deep)
            if key in seen:
                raise yaml.constructor.ConstructorError(
                    None, None, f"clé en double : '{key}'", key_node.start_mark)
            seen.add(key)
        return super().construct_mapping(node, deep=deep)


def load_categories():
    cfg = yaml.safe_load((ROOT / "_config.yml").read_text(encoding="utf-8"))
    return cfg.get("category_list", [])


def split_front_matter(text):
    lines = text.lstrip("\ufeff").splitlines()
    if not lines or lines[0].rstrip() != "---":
        return None, None, "Le fichier doit commencer par '---' (première ligne)."
    for i in range(1, len(lines)):
        if lines[i].rstrip() == "---":
            return "\n".join(lines[1:i]), "\n".join(lines[i + 1:]), None
    return None, None, "Ligne de fermeture '---' introuvable (seule sur sa ligne)."


def check_list(data, key, errors):
    items = data.get(key)
    if not isinstance(items, list) or not items:
        errors.append(f"'{key}' doit être une liste non vide (lignes commençant par '  - ').")
        return
    for n, item in enumerate(items, 1):
        if isinstance(item, (dict, list)):
            errors.append(f"{key} #{n} : contient un ':' non protégé. Mets l'élément entre guillemets.")
        elif isinstance(item, bool) or item is None or not str(item).strip():
            errors.append(f"{key} #{n} : élément vide ou invalide.")
        else:
            s = str(item).strip()
            if "**" in s:
                errors.append(f"{key} #{n} : pas de **gras** dans les listes.")
            if key == "ingredients" and re.fullmatch(r"\(.*\)", s):
                errors.append(f"ingredients #{n} : pour un titre de section, utilise \"— TITRE —\" entre guillemets.")


def validate(path, categories):
    errors, warnings = [], []

    # --- Nom de fichier ---
    file_date = None
    m = FILENAME_RE.match(path.name)
    if not m:
        errors.append("Nom de fichier invalide. Format : AAAA-MM-JJ-nom-de-la-recette.md "
                      "(minuscules, chiffres et tirets; sans accents, espaces ni '_').")
    else:
        try:
            file_date = datetime.date(int(m[1]), int(m[2]), int(m[3]))
        except ValueError:
            errors.append("La date dans le nom de fichier n'existe pas.")

    # --- En-tête ---
    text = path.read_text(encoding="utf-8")
    fm_text, body, err = split_front_matter(text)
    if err:
        return [err], warnings
    if "\t" in fm_text:
        errors.append("Tabulation détectée dans l'en-tête : utilise des espaces (2 par niveau).")
    if re.search(r"^layout:\s*recipe", body, re.M):
        errors.append("Deux recettes semblent collées dans le même fichier. Un fichier = une recette.")

    try:
        data = yaml.load(fm_text, Loader=UniqueKeyLoader)
    except yaml.YAMLError as e:
        mark = getattr(e, "problem_mark", None)
        where = f" (ligne {mark.line + 2})" if mark else ""
        errors.append(f"YAML invalide{where} : {getattr(e, 'problem', e)}")
        return errors, warnings
    if not isinstance(data, dict):
        return errors + ["L'en-tête est vide ou n'est pas une liste de champs."], warnings

    # --- Champs ---
    for key, value in data.items():
        if value is None:
            errors.append(f"Le champ '{key}' est vide : mets une valeur ou supprime la ligne.")
        if key not in REQUIRED + OPTIONAL:
            warnings.append(f"Champ inconnu '{key}' (faute de frappe ?).")
    for key in REQUIRED:
        if key not in data:
            errors.append(f"Champ obligatoire manquant : '{key}'.")

    if data.get("layout") not in (None, "recipe"):
        errors.append("'layout' doit valoir 'recipe'.")
    if "title" in data and not (isinstance(data["title"], str) and data["title"].strip()):
        errors.append("'title' doit être un texte non vide.")
    if "category" in data and data["category"] not in categories:
        errors.append(f"'category' doit correspondre exactement à _config.yml : {', '.join(categories)}.")

    d = data.get("date")
    if d is not None:
        if isinstance(d, datetime.datetime):
            d = d.date()
        if not isinstance(d, datetime.date):
            errors.append("'date' doit être au format AAAA-MM-JJ.")
        elif file_date and d != file_date:
            errors.append(f"'date' ({d}) ne correspond pas à la date du nom de fichier ({file_date}).")

    for key in ("ingredients", "steps"):
        if key in data and data[key] is not None:
            check_list(data, key, errors)

    if "tags" in data and data["tags"] is not None:
        tags = data["tags"]
        if not isinstance(tags, list) or not all(isinstance(t, (str, int)) for t in tags):
            errors.append("'tags' doit être une liste : [Tag1, Tag2].")
    if "difficulty" in data and data["difficulty"] is not None:
        if str(data["difficulty"]).strip().lower() not in DIFFICULTES:
            errors.append("'difficulty' doit être Facile, Moyen ou Difficile.")
    if "notes" in data and data["notes"] is not None and not isinstance(data["notes"], str):
        errors.append("'notes' doit être un texte entre guillemets, sur une seule ligne.")
    img = data.get("image")
    if img:
        if not str(img).startswith("/assets/images/"):
            errors.append("'image' doit commencer par /assets/images/.")
        elif not (ROOT / str(img).lstrip("/")).is_file():
            errors.append(f"Image introuvable : {img} (vérifie le nom et les majuscules).")

    return errors, warnings


def report(level, rel, msg):
    if ON_GITHUB:
        print(f"::{level} file={rel}::{msg}")
    else:
        print(f"{'❌' if level == 'error' else '⚠️ '} {rel} : {msg}")


def main():
    args = sys.argv[1:]
    files = [Path(a).resolve() for a in args] if args else sorted((ROOT / "_posts").rglob("*.md"))
    files = [f for f in files if f.suffix == ".md" and "_posts" in f.parts]
    if not files:
        print("Aucune recette à valider.")
        return 0

    categories = load_categories()
    n_err = n_warn = n_bad = 0
    for f in files:
        rel = f.relative_to(ROOT).as_posix()
        errors, warnings = validate(f, categories)
        for msg in errors:
            report("error", rel, msg)
        for msg in warnings:
            report("warning", rel, msg)
        n_err += len(errors)
        n_warn += len(warnings)
        n_bad += bool(errors)

    print(f"\n{len(files)} fichier(s) vérifié(s) : {n_bad} en erreur, {n_warn} avertissement(s).")
    return 1 if n_err else 0


if __name__ == "__main__":
    sys.exit(main())
