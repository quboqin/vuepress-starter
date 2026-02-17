# AGENTS.md - AI Coding Assistant Guidelines

## Project Overview

VuePress v1 static site generator for a technical documentation blog. Content is Markdown-based, deployed to GitHub Pages.

**Tech Stack:** VuePress v1.8.2, Markdown, Vue.js (legacy version)

## Build Commands

```bash
# Development server (hot reload)
npm run docs:dev

# Production build
npm run docs:build

# Deploy to GitHub Pages
./deploy.sh
```

**No test suite configured** - This is a documentation site without unit tests.

## Project Structure

```
docs/
├── .vuepress/
│   ├── config.js          # VuePress site configuration
│   └── public/            # Static assets (avatar.png)
├── README.md              # Homepage with YAML frontmatter
├── guide/                 # Navigation hub
├── openwrt/               # OpenWRT documentation section
├── windows-wsl/           # WSL setup guide
├── vuepress/              # VuePress docs
├── node-vue/              # Node.js/Vue.js tutorials
├── AIGC/                  # AI/ML content
├── ci/                    # CI/CD documentation
├── eslint/                # ESLint configuration docs
└── clash.md               # Proxy configuration
```

## Markdown Content Guidelines

### Frontmatter Format

```yaml
---
home: true                    # For homepage only
heroImage: /avatar.png
heroText: Page Title
tagline: Subtitle text
actionText: Button Text →
actionLink: /guide/
features:                     # Feature cards
  - title: Title
    details: Description text
footer: MIT Licensed | Copyright © 2024
sidebar: auto                 # Auto-generate sidebar from headers
---
```

### Content Style

- **Language**: Bilingual (Chinese primary, English technical terms)
- **Headers**: Use ATX-style (`# Heading`)
- **Code blocks**: Specify language for syntax highlighting
  - `bash` - Shell commands
  - `powershell` - Windows PowerShell
  - `json` - Configuration files
  - `yaml` - Docker Compose, K8s configs
  - `javascript` / `vue` - Code examples
- **Links**: Use relative paths for internal docs (`/guide/`, `/openwrt/`)
- **Images**: Store in `docs/.vuepress/public/`, reference with `/filename.png`

### Code Block Examples

```markdown
```bash
# Shell commands
sudo apt-get update
```

```powershell
# PowerShell commands
dism.exe /online /enable-feature
```

```json
{
  "key": "value"
}
```
```

## VuePress Configuration

**File:** `docs/.vuepress/config.js`

```javascript
module.exports = {
  title: 'Site Title',
  description: 'Site description',
  base: '/blog2021/',        // GitHub Pages base path
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'External', link: 'https://example.com' }
    ]
  }
}
```

## Writing Conventions

### File Naming
- Use lowercase with hyphens: `github-action.md`, `windows-wsl.md`
- Index files: `README.md` (becomes `index.html`)
- Group related docs in folders with descriptive names

### Content Organization
- Use H1 (`#`) for page title
- Use H2 (`##`) for major sections
- Use H3 (`###`) for subsections
- Include table of contents for long documents (use `sidebar: auto`)

### Tables
Use GFM-style tables for comparisons:

```markdown
| Device | Price | CPU | RAM |
|--------|-------|-----|-----|
| **NanoPi R4S** | ~800元 | RK3399 | 4GB |
```

### Emojis
- ✅ for features/checklists
- 🚀 for advanced features
- 🔧 for configuration sections
- 📖 for documentation references
- ❓ for FAQ items

## Deployment

The `deploy.sh` script:
1. Builds the site to `docs/.vuepress/dist/`
2. Initializes a git repo in the dist folder
3. Force-pushes to `gh-pages` branch

**Deployment target:** `quboqin/blog2021` GitHub repository

## Common Tasks

### Add New Section
1. Create folder under `docs/` (e.g., `docs/new-section/`)
2. Add `README.md` as the section index
3. Add navigation link to `docs/.vuepress/config.js`
4. Reference from `docs/guide/README.md`

### Add Static Assets
1. Place files in `docs/.vuepress/public/`
2. Reference with root-relative path: `/avatar.png`

### Update Homepage
- Edit `docs/README.md`
- Modify YAML frontmatter for hero section and features

## Notes

- No ESLint, Prettier, or TypeScript configured
- No automated testing framework
- Content-focused project - prioritize clear documentation over code complexity
- Bilingual content expected; preserve both Chinese and English where present
- VuePress v1 is legacy; migration to v2 may be needed in future
