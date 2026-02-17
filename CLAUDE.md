# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VuePress v1.8.2 static site generator for a technical documentation blog. Content is Markdown-based, deployed to GitHub Pages at `quboqin.github.io/blog2021`.

## Build & Development Commands

```bash
# Development server with hot reload
npm run docs:dev

# Production build (outputs to docs/.vuepress/dist/)
npm run docs:build

# Deploy to GitHub Pages (builds + force-pushes to gh-pages branch)
./deploy.sh
```

**Note:** No test suite is configured. This is a documentation site without unit tests.

## Architecture

### VuePress Configuration

**Primary config:** `docs/.vuepress/config.js`
- `base: '/blog2021/'` - GitHub Pages base path (DO NOT change without updating deploy script)
- `themeConfig.nav` - Top navigation bar links
- Uses VuePress v1 (legacy version)

### Content Structure

```
docs/
├── .vuepress/
│   ├── config.js          # Site configuration (title, nav, base path)
│   └── public/            # Static assets (reference as /filename.png)
├── README.md              # Homepage (uses YAML frontmatter)
├── guide/                 # Central navigation hub
├── openwrt/               # OpenWRT networking docs
├── windows-wsl/           # WSL setup guides
├── AIGC/                  # AI/ML content
├── ci/                    # CI/CD documentation
└── [other sections]/      # Topic-specific folders
```

**Content Discovery:** Check `docs/guide/README.md` for the main content index.

## Markdown Content Conventions

### Frontmatter Structure

```yaml
---
sidebar: auto              # Auto-generate sidebar from headers (use for long docs)
home: true                 # ONLY for docs/README.md homepage
heroImage: /avatar.png     # Must be in docs/.vuepress/public/
---
```

### Language & Style

- **Bilingual:** Chinese primary text with English technical terms
- **Code blocks:** Always specify language (bash, powershell, json, yaml, javascript, vue)
- **Internal links:** Use relative paths (`/guide/`, `/openwrt/`)
- **Static assets:** Place in `docs/.vuepress/public/`, reference as `/filename.png`

### Code Block Examples

````markdown
```bash
# Shell commands
sudo systemctl restart openwrt
```

```powershell
# Windows PowerShell
dism.exe /online /enable-feature
```
````

## Common Operations

### Add New Documentation Section

1. Create folder: `docs/new-section/`
2. Add index: `docs/new-section/README.md`
3. Update nav in `docs/.vuepress/config.js`:
   ```javascript
   nav: [
     // ...
     { text: 'New Section', link: '/new-section/' }
   ]
   ```
4. Add link from `docs/guide/README.md`

### Add Static Assets

Place files in `docs/.vuepress/public/`, then reference with root path:
```markdown
![Image](/filename.png)
```

## Deployment Details

The `deploy.sh` script:
1. Runs `npm run docs:build`
2. Creates fresh git repo in `docs/.vuepress/dist/`
3. Force-pushes to `quboqin/blog2021` repo's `gh-pages` branch

**Warning:** This uses `git push -f`, which overwrites the gh-pages branch history.

## Project Constraints

- VuePress v1 is in maintenance mode (consider migration to v2 in future)
- No ESLint, Prettier, or TypeScript configured
- No automated testing framework
- Content-focused project - prioritize documentation clarity
