# Vue 3 + Vite Project Setup (2026)
## 1. Create Project


```bash
# In parent directory
code npm create vue@latest "project-name"
```

Recommended choices:

```bash
- Package name: "project-name"
- TypeScript: No 
- Linter: yes
- Prettier: yes
- JSX: No
- Router: No 
- Pinia: No 
- Tests: No 
- Experimental: None
- Blank project: yes
```

## 2. Install & Start

```bash
cd "project-name"
npm install
npm run dev
```
✅ Verify: http://localhost:5173/ displays correctly  

## 3. Generated Base Structure  

```
"project-name"/
├── src/
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 4. Commands

```bash
npm run dev     # Development
npm run build   # Production
npm run preview # Preview build
```