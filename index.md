---
layout: default
title: Home
description: "Freaky's homelab — self-hosted services, Linux, automation and endless tinkering."
---

<!-- ── Hero ── -->
<section class="hero fade-up">
  <div class="hero-eyebrow">homelab · linux · telecom</div>
  <h1 class="hero-title">
    <span class="accent">network</span><span class="accent-blue">eclipse</span><br>
    <span class="dim">// always tinkering. //</span>
  </h1>
  <p class="hero-sub">
    Telecom tech by day, homelab hacker by night. I self-host everything I can,
    automate what I shouldn't, and document the chaos so future-me doesn't cry.
  </p>

  <!-- Terminal block -->
  <div class="terminal fade-up fade-up-2">
    <div class="terminal-bar">
      <div class="terminal-dots">
        <span class="dot-red"></span>
        <span class="dot-amber"></span>
        <span class="dot-green"></span>
      </div>
      <div class="terminal-title">freaky@homelab — bash</div>
    </div>
    <div class="terminal-body">
      <div id="typed-output"></div>
    </div>
  </div>
</section>

<!-- ── Quick stats ── -->
<section class="fade-up fade-up-2">
  <div class="section-header">
    <h2 class="mono">// lab status</h2>
    <div class="section-line"></div>
    <span class="status-dot up"></span><span style="font-size:0.78rem; color: var(--green); font-family: var(--font-mono);">all systems go</span>
  </div>

  <div class="stat-grid">
    <div class="stat-card">
      <span class="stat-num">12+</span>
      <span class="stat-label">Dockers</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">1</span>
      <span class="stat-label">Tor Node</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">5</span>
      <span class="stat-label">VMs running</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">99%</span>
      <span class="stat-label">uptime goal</span>
    </div>
    <div class="stat-card">
      <span class="stat-num">24/7</span>
      <span class="stat-label">self-hosted</span>
    </div>
  </div>
</section>

<!-- ── Quick links ── -->
<section class="fade-up fade-up-3" style="margin-top: 2.5rem;">
  <div class="section-header">
    <h2 class="mono">// explore</h2>
    <div class="section-line"></div>
  </div>

  <div class="card-grid">
    <a href="{{ '/blog/' | relative_url }}" class="card" style="text-decoration:none;">
      <div class="card-title">📓 Lab Notes</div>
      <p class="card-desc">Setup guides, war stories, and knowledge base entries from the trenches.</p>
      <div class="card-tags">
        <span class="badge badge-green">blog</span>
        <span class="badge badge-gray">guides</span>
      </div>
    </a>

  <div class="card card-link">
      <a href="{{ '/projects/' | relative_url }}" class="card-link-anchor" aria-label="The Stack"></a>
      <div class="card-title">🛠 The Stack</div>
      <p class="card-desc">Docker containers, Home Assistant automations, and everything in between.</p>
      <div class="card-tags">
        <span class="badge badge-amber">docker</span>
        <span class="badge badge-blue">homeassistant</span>
      </div>
    </div>

 <div class="card card-link">
      <a href="{{ '/docs/' | relative_url }}" class="card-link-anchor" aria-label="Runbooks"></a>
      <div class="card-title">📖 Runbooks</div>
      <p class="card-desc">Troubleshooting notes and setup docs so I don't repeat my own mistakes.</p>
      <div class="card-tags">
        <span class="badge badge-purple">docs</span>
        <span class="badge badge-gray">reference</span>
      </div>
    </div>
 
 <div class="card card-link">
      <a href="{{ '/about/' | relative_url }}" class="card-link-anchor" aria-label="whoami"></a>
      <div class="card-title">~$ whoami</div>
      <p class="card-desc">Telecom tech, Linux daily driver, chronic tinkerer. The human behind the lab.</p>
      <div class="card-tags">
        <span class="badge badge-cyan">telecom</span>
        <span class="badge badge-green">linux</span>
      </div>
    </div>
  </div>
</section>

<!-- ── Recent posts ── -->
<section class="fade-up fade-up-4" style="margin-top: 2.5rem;">
  <div class="section-header">
    <h2 class="mono">// recent lab notes</h2>
    <div class="section-line"></div>
    <a href="{{ '/blog/' | relative_url }}" style="font-family: var(--font-mono); font-size: 0.78rem; white-space: nowrap;">view all →</a>
  </div>

  <ul class="post-list">
    {% for post in site.posts limit:4 %}
    <li class="post-item">
      <div>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 100 }}</p>
      </div>
      <div class="post-date">{{ post.date | date: "%b %d, %Y" }}</div>
    </li>
    {% else %}
    <li class="post-item">
      <div>
        <span style="font-family: var(--font-mono); color: var(--text-3); font-size:0.85rem;">// no posts yet — first entry coming soon</span>
      </div>
    </li>
    {% endfor %}
  </ul>
</section>
