# SPEC — Portfolio Redesign (btphuong2017.github.io)

**Goal:** Rebuild the portfolio UI/UX in the existing Next.js repo to match the approved prototype, and sync all content with the current CV set. The prototype is the single source of truth for visual design; this spec is the single source of truth for content and facts.

**Workflow note:** Implement in phases with a human checkpoint after Phase 2 (visual parity) and Phase 4 (content, both locales). Do not deploy before final human review.

---

## 1. Inputs (place in repo before starting)

| File | Purpose |
|---|---|
| `design/Portfolio-Redesign-Prototype.html` | Approved prototype. Match layout, spacing, typography, colors, and interactions. Copy design tokens from its `<style>` block. |
| `public/CV-Bui-Thanh-Phuong-Senior-Frontend-React.pdf` | New CV file for the Download CV button. Delete the old `CV - Phuong Bui Thanh.pdf`. |

## 2. Design system

Extract from prototype CSS. Key tokens:

- Colors: `--paper:#FAFAF7`, `--surface:#F1F4F0`, `--ink:#17201D`, `--text:#2A332F`, `--muted:#5E6B66`, `--hair:#DCE2DD`, `--accent:#0E6A4E`, `--accent-soft:#E3EFE9`. Light theme only for now (remove the current dark theme and theme toggle; a dark variant is out of scope).
- Typography: IBM Plex Sans (400/600/700) for text and display; IBM Plex Mono (400/600) for all meta layers (eyebrows, dates, section tags, tech lines, skill labels, nav mark). Self-host via `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` or `next/font/local` with woff2 subsets (latin + vietnamese). Do NOT load from Google Fonts CDN.
- Radius: 2–4px only. Hairline borders `1px solid var(--hair)`. No shadows except none.
- Max content width 1080px, 28px side padding.

## 3. Page structure (both locales)

Sections in order — anything not listed here is REMOVED (notably: the old About section, the "Request case study" mailto CTA, the standalone stats in hero, the old Impact section's duplicated stats):

1. **Nav** (sticky): mark `btphuong.dev` (mono, accent dot) · links Work / Experience / Skills / Contact · locale switcher EN/VI. Mobile: links hidden (hamburger optional, low priority).
2. **Hero**: eyebrow → h1 name → lede → CTA row (`View work` primary anchor to #work, `Download CV` secondary, direct file download) → meta line → **signature platform-map card** (3 repo cells + note).
3. **Metrics strip**: single 4-cell row. This is the ONLY stats block on the page.
4. **Work** (`#work`): 4 case-study rows, each with header (name + role/dates mono), 2×2 grid Problem/Decision/Outcome/My role, VELA additionally gets the mono architecture diagram block, then a Tech mono line.
5. **Experience** (`#experience`): timeline list, 3 entries, each with 1–2 line description.
6. **Skills** (`#skills`): exactly 3 label/value lines. No chips.
7. **Contact** (`#contact`): headline with inline mailto link + link row (Email / LinkedIn / tel / location text).
8. **Footer**: copyright + one-line note.

## 4. Behavior

- Scroll-reveal via IntersectionObserver (threshold ~0.15), one-shot, `prefers-reduced-motion: reduce` disables all motion.
- Smooth anchor scrolling; `:focus-visible` outlines in accent.
- Platform-map cells may stagger-reveal (100ms steps). No other animation.
- All external links `rel="noopener"`. No circular self-links: the old per-project "GitHub profile" links pointing to btphuong2017.github.io are removed entirely.
- Footer/contact links must be labeled ("Email", "LinkedIn") — never raw URLs or `mailto:` text.

## 5. FACT INVARIANTS — must appear exactly as stated, in both locales

These override anything currently in the repo:

- Positioning: **Senior Frontend Engineer & Team Lead** (page title, OG meta, hero eyebrow). Never "Frontend Architect & Team Lead".
- Contact tag: open to **senior frontend & lead roles**.
- VELA dates: **Jul 2023 – Mar 2026**. Never "Present".
- VELA architecture: 3 repositories, all multi-tenant — **core-portal: React/Next.js single application (internal operations)**; **customer-portal: Angular, Nx Monorepo, Micro Frontend (host + remotes)**; **supplier-portal: Angular, Nx Monorepo, Micro Frontend (host + remotes)**.
- Bundle metric: Core Portal initial bundle **12 MB → 3 MB (−75%)**, measured with webpack-bundle-analyzer. Appears in exactly two places: metrics strip (−75% cell) and VELA Outcome. Not in the hero.
- Team scope: led **8 frontend developers**, project team of **60**, **4 frontend repositories** for CI/CD claims.
- AMIT timeline: Frontend Developer **Jun 2018 – Dec 2021**; Senior Frontend Developer **Dec 2021 – Jul 2023**. Internship **Jun–Dec 2017**, returned full-time after graduation. (The current site's "2018-09 – 2018-12" internship dates are WRONG — replace.)
- SOGUS: two separate applications — Angular internal administration portal; React/Next.js candidate-facing landing/interview/testing. Nov 2022 – Jul 2023, project team of 10, role Frontend Team Leader.
- Medbuy: role **Senior Frontend Developer** (current site says "Frontend Developer" — wrong), Dec 2022 – Jul 2023, "pharmaceutical suppliers" (never "drug suppliers").
- Kensa: Fullstack Developer, Mar 2021 – Jul 2021, team of 2, VNPay + Payoo.
- Education (if shown anywhere): Bachelor of Information Technology — University of Transport and Communications, Ho Chi Minh City Campus. No "(UTC2)".
- AWS always as: AWS (EC2, S3, CloudFront, Route 53, IAM).
- Phone: +84 964 747 781. LinkedIn: https://www.linkedin.com/in/phuong-bui-thanh-3035a0227/

## 6. Copy — EN

Use the prototype's copy verbatim. Canonical blocks (abbreviated here; full text in prototype):

- Hero lede: "Eight years building enterprise web platforms with **React/Next.js** and **Angular**. I design frontend architecture, keep it fast, and lead the team that ships it."
- Platform-map note: "Each portal gets the stack and architecture its delivery needs — a React/Next.js Core app owned end-to-end by one team; Customer and Supplier ship as independent Angular Micro Frontend platforms so teams deploy in parallel."
- Metrics labels: years frontend / developers led / portals architected / initial bundle size.
- Skills section tag: "what I'd defend in an interview". Three lines exactly as in prototype (Frontend / Architecture & delivery / Also).
- Contact headline: "Building something where scale, performance and team quality matter? btphuong2017@gmail.com"

## 7. Copy — VI (translations)

Labels: Vấn đề / Quyết định / Kết quả / Vai trò. Section titles: Dự án tiêu biểu / Kinh nghiệm / Kỹ năng / Liên hệ. Nav: giữ nguyên tiếng Anh (Work/Experience/Skills/Contact) hoặc dịch — ưu tiên giữ tiếng Anh cho gọn.

- Eyebrow: giữ "Senior Frontend Engineer & Team Lead".
- HELLO, I'M → "XIN CHÀO, TÔI LÀ"
- Lede: "8 năm xây dựng các nền tảng web doanh nghiệp với **React/Next.js** và **Angular**. Tôi thiết kế kiến trúc frontend, giữ cho nó nhanh, và dẫn dắt đội ngũ đưa nó ra sản phẩm."
- CTA: "Xem dự án" / "Tải CV". Meta: "TP. Hồ Chí Minh · 8 năm kinh nghiệm · dẫn dắt team 8 người".
- Platform map: title "VELA · Kiến trúc frontend tôi thiết kế"; src "3 repository · tất cả multi-tenant"; cells giữ tên tiếng Anh (core-portal / customer-portal / supplier-portal, mô tả kỹ thuật giữ nguyên); desc core: "vận hành nội bộ". Note: "Mỗi portal dùng đúng stack và kiến trúc mà nhu cầu vận hành của nó đòi hỏi — Core Portal React/Next.js do một team sở hữu trọn vẹn; Customer và Supplier là các nền tảng Micro Frontend Angular độc lập, cho phép các team deploy song song."
- Metrics: "năm làm frontend" / "developer đã dẫn dắt" / "portal đã kiến trúc" / "initial bundle".
- Tag mục Work: "Vấn đề → Quyết định → Kết quả".
- VELA — Vấn đề: "Nền tảng logistics multi-tenant cho người dùng nội bộ và bên ngoài — ba portal, một chương trình 60 người, các team cần ship song song mà không giẫm chân nhau." Quyết định: "Ba repository, tất cả multi-tenant: Core Portal **React/Next.js** dạng ứng dụng đơn, và các nền tảng **Micro Frontend Angular trên Nx Monorepo** riêng biệt (host + remotes) cho Customer và Supplier. Quality gate Jasmine + SonarQube trong pipeline CI/CD Docker/Kubernetes." Kết quả: "Deploy độc lập và phát triển song song giữa các team; initial bundle của Core Portal giảm từ **12 MB xuống 3 MB** (webpack-bundle-analyzer); dẫn dắt team 8 người xây dựng và vận hành." Vai trò: "Kiến trúc, chuẩn engineering, quy trình code review, chiến lược GitFlow — đồng thời trực tiếp code trên cả React/Next.js và Angular, bao gồm phần tối ưu hiệu năng Core Portal."
- SOGUS — Vấn đề: "Sàng lọc ứng viên với nhiều hình thức đánh giá — và hai nhóm người dùng rất khác nhau: quản trị viên nội bộ và ứng viên làm bài thi." Quyết định: "Hai ứng dụng riêng biệt: **Angular** cho portal quản trị nội bộ, **React/Next.js** cho landing, phỏng vấn và luồng làm bài phía ứng viên." Kết quả: "Vòng đời bài thi thống nhất trên cả hai ứng dụng, giao bởi project team 10 người với frontend workstream do tôi dẫn dắt." Vai trò: "Kiến trúc frontend trên cả hai stack, lập kế hoạch task, review PR, làm việc với stakeholder."
- Medbuy — Vấn đề: "Sàn thương mại điện tử kết nối nhà cung cấp dược phẩm, đại lý và người dùng cuối — UX responsive với tích hợp backend ổn định." Quyết định: "Frontend React/Next.js xây dựng sát cùng đội UX/UI; thống nhất REST API contract với team backend NestJS." Kết quả: "Giao diện responsive, đúng thiết kế, chạy production với deployment container hóa." Vai trò: "Triển khai frontend và tích hợp API trong project team 10 người."
- Kensa — Vấn đề: "Quản lý đơn hàng và doanh thu với Admin và Customer portal, kèm thanh toán trực tuyến." Quyết định: "Xây end-to-end trong team 2 người: frontend React, REST API Laravel, tích hợp thanh toán VNPay và Payoo, deploy Docker trên Linux." Kết quả: "Luồng xử lý đơn, báo cáo và thanh toán chạy production." Vai trò: "Toàn bộ từ frontend đến backend — dự án dạy tôi cái giá của full ownership."
- Experience mô tả (3 entry): dịch tương ứng từ prototype, giữ mốc thời gian và con số đúng Fact Invariants.
- Skills tag: "những gì tôi sẵn sàng bảo vệ khi phỏng vấn". Ba dòng giữ tên công nghệ tiếng Anh; label: Frontend / Kiến trúc & Delivery / Khác. Dòng "Khác" kết bằng: "— và workflow AI-assisted hằng ngày với Cursor và Claude Code".
- Contact tag: "sẵn sàng cho vị trí senior frontend & lead". Headline: "Bạn đang xây thứ gì đó mà scale, hiệu năng và chất lượng đội ngũ thực sự quan trọng? btphuong2017@gmail.com"
- Footer: "© 2026 Bùi Thanh Phương" · "Plex Sans/Mono · cùng hệ thiết kế với bản CV bạn vừa tải".

## 8. Technical requirements

- Next.js static export compatible with GitHub Pages (current hosting). Keep existing i18n routing (`/en`, `/vi`); root `/` redirects to `/en`.
- Update `<title>` and all OG/Twitter meta to the new positioning; regenerate OG image if one exists (text-only OG card in the new design system is acceptable).
- Lighthouse targets: Performance ≥ 95, Accessibility ≥ 95 on both locales. Fonts subset + `font-display: swap`.
- Keep GTM/analytics as currently configured.
- Component structure suggestion: `Nav`, `Hero` (with `PlatformMap`), `MetricsStrip`, `WorkRow`, `ArchDiagram`, `ExperienceItem`, `SkillLine`, `ContactBlock`, `Footer`. Copy lives in locale JSON/TS dictionaries — no hardcoded strings in components.

## 9. Acceptance checklist

- [ ] Visual parity with prototype at 1440px, 1024px, 768px, 390px.
- [ ] Every Fact Invariant present and correct in BOTH locales (grep for "Present", "2018-09", "Architect &", "drug suppliers", "(UTC2)" — all must return zero).
- [ ] Download CV serves the new PDF; old PDF deleted.
- [ ] No raw URLs or `mailto:` text visible; no self-referencing project links.
- [ ] Reduced-motion honored; keyboard navigation with visible focus.
- [ ] Old sections (About, Impact stats duplication, Request case study) removed.
- [ ] Build passes; static export deploys on GitHub Pages preview.

## 10. Out of scope

Dark mode; blog; new case-study detail pages; hamburger menu; Independent Projects section (planned as a follow-up phase — do not scaffold).
