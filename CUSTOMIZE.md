# Portfolio Customization Guide

This portfolio is now ready for you to populate with your personal data from your CV.

## Quick Start

All your content data lives in JSON files under `src/data/`. Edit these files with your actual information:

### 1. **Profile** (`src/data/profile.json`)
Update with your personal information:
- Full name
- Professional title
- Bio/Summary
- Contact info (email, phone)
- Social links (GitHub, LinkedIn, Portfolio)

### 2. **Skills** (`src/data/skills.json`)
Organize your skills by category:
- Languages
- Frontend Technologies
- Backend Technologies
- Tools & Platforms
- etc.

### 3. **Experience** (`src/data/experience.json`)
Add your work experience entries with:
- Company name
- Job title/role
- Start and end dates (format: YYYY-MM)
- Description of achievements and responsibilities

### 4. **Projects** (`src/data/projects.json`)
List your projects with:
- Project title
- Description
- Technologies used
- GitHub repository URL
- Live demo URL (if available)

## File Structure

```
src/
├── data/
│   ├── profile.json       ← Your personal info
│   ├── skills.json        ← Your technical skills
│   ├── experience.json    ← Your work history
│   └── projects.json      ← Your portfolio projects
├── features/
│   └── home/
│       ├── HeroSection.tsx        (displays profile data)
│       ├── ExperienceSection.tsx  (displays experience)
│       ├── ProjectsSection.tsx    (displays projects)
│       └── SkillsSection.tsx      (displays skills)
├── shared/
│   ├── components/
│   │   ├── ThemeProvider.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppFooter.tsx
│   │   ├── Container.tsx
│   │   └── Section.tsx
│   └── utils/
│       └── cn.ts
├── messages/
│   ├── en.json (English translations)
│   └── vi.json (Vietnamese translations)
└── app/
    ├── layout.tsx
    ├── globals.css
    └── [locale]/
        ├── layout.tsx (i18n wrapper)
        └── page.tsx   (home page with all sections)
```

## How to Edit

1. **Open a data file** in VS Code:
   ```bash
   cd "D:/Works/Pet Projects/portfolio/portfolio"
   code .
   ```

2. **Edit the JSON content** with your actual information

3. **Run dev server** to see changes:
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000/en or http://localhost:3000/vi

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

## Features Included

- ✅ **Dark/Light Mode** — Toggle theme in header
- ✅ **Bilingual** — Switch between English (en) and Vietnamese (vi)
- ✅ **Static Export** — Ready for GitHub Pages deployment
- ✅ **Responsive** — Mobile-first design with Tailwind CSS
- ✅ **Modern UI** — shadcn/ui components with icons (lucide-react)
- ✅ **TypeScript** — Full type safety
- ✅ **SEO Ready** — Meta tags in layout

## Next Steps

1. Populate the JSON files with your CV data
2. Update the footer links (GitHub, LinkedIn, Contact)
3. Add your photo to `public/` and reference in a profile component
4. Customize colors by editing CSS variables in `src/app/globals.css`
5. Deploy to GitHub Pages using `next export`

## Deployment to GitHub Pages

Add to `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/portfolio-repo-name',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

Then:
```bash
npm run build
# Deploy the `out/` folder to your GitHub Pages repo
```

---

**Happy building! 🚀**
