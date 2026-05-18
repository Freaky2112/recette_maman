# 🍽️ Mom's Kitchen — Jekyll Recipe Website

A warm, rustic recipe website built with Jekyll, ready to deploy on GitHub Pages.

## 🚀 Quick Setup

### 1. Install Jekyll locally (optional, for previewing)
```bash
gem install bundler jekyll
bundle install
bundle exec jekyll serve
```
Then open `http://localhost:4000` in your browser.

### 2. Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `yourusername.github.io` or `moms-recipes`)
2. Push this folder to that repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Mom's Kitchen 🍲"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to your repo → **Settings → Pages**
4. Under **Source**, choose **GitHub Actions**
5. The site will auto-deploy! 🎉

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 📝 Adding a New Recipe

Create a new file in `_posts/` following this naming format:

```
_posts/YYYY-MM-DD-recipe-name.md
```

Copy this template:

```yaml
---
layout: recipe
title: "Your Recipe Title"
description: "A short, mouth-watering description."
category: "Desserts"        # Breakfast | Soups & Stews | Mains | Sides | Desserts | Baking | Drinks
emoji: "🍰"                 # Shown when there's no image
date: 2024-01-01
prep_time: "15 min"
cook_time: "30 min"
servings: 4
difficulty: Easy            # Easy | Medium | Hard
ingredients:
  - 2 cups flour
  - 1 cup sugar
  - ...
steps:
  - Step one instructions here.
  - Step two instructions here.
notes: "Optional tip or memory from Mom."
---
```

### Adding a photo
Put your image in `assets/images/` and add to the front matter:
```yaml
image: /assets/images/my-recipe-photo.jpg
```

---

## 🗂 Site Structure

```
moms-recipes/
├── _config.yml          # Site settings
├── _layouts/
│   ├── default.html     # Main layout (header + footer)
│   └── recipe.html      # Recipe page layout
├── _includes/
│   ├── header.html
│   ├── footer.html
│   └── recipe-card.html
├── _posts/              # ← Your recipes go here!
├── assets/
│   ├── css/main.scss    # All styles
│   └── js/main.js       # Category filter
├── index.html           # Homepage
├── recipes.html         # All recipes listing
├── about.md             # About page
└── Gemfile
```

---

## ✏️ Customization

- **Site title & description**: Edit `_config.yml`
- **Colors & fonts**: Edit `assets/css/main.scss` (CSS variables at the top)
- **Categories**: Add/remove from `category_list` in `_config.yml`
- **About page**: Edit `about.md`
