# Mas Formation — React + Vite + Tailwind CSS

US Tax Filing & LLC Services landing page built with:
- **React 18** — UI framework
- **Vite** — lightning-fast dev server & build tool
- **Tailwind CSS v3** — utility-first styling
- **Zustand** — lightweight global state management

## Project Structure

```
mas-formation/
├── public/
│   └── logo.png              # Favicon & navbar logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Fixed navbar with mobile menu
│   │   ├── Hero.jsx          # Hero section with animated doc card
│   │   ├── WhyChoose.jsx     # 6-feature cards with scroll reveal
│   │   ├── HowItWorks.jsx    # Scroll-driven vertical timeline (Steps 1–4)
│   │   ├── FAQ.jsx           # Accordion FAQ (Zustand state)
│   │   ├── TaxForm.jsx       # Full tax filing form (Zustand state)
│   │   └── Footer.jsx        # Footer with gradient top bar
│   ├── store/
│   │   └── useStore.js       # Zustand store (form, FAQ, mobile menu)
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind + custom CSS
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 3. Build for production
```bash
npm run build
```
Output goes to `/dist` folder — ready to deploy on Netlify, Vercel, or any static host.

### 4. Preview production build
```bash
npm run preview
```

## Zustand State (src/store/useStore.js)

| State | Description |
|---|---|
| `form` | All tax filing form fields |
| `formSubmitted` | Whether form was submitted successfully |
| `formLoading` | Submit loading state |
| `openFaqIndex` | Which FAQ item is open |
| `mobileMenuOpen` | Mobile nav menu open/close |

## Deploy to Netlify (free)
1. Run `npm run build`
2. Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
