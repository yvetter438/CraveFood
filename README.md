# CraveFood Landing Page

A beautiful, responsive landing page built with Next.js 14 and Tailwind CSS.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

**All customization happens in one place:** `src/config/site.config.ts`

### What You Can Edit:

#### 1. **Typography**
Control all text styles (H1, H2, H3, Paragraph, Links):
```typescript
typography: {
  h1: {
    className: "text-5xl md:text-6xl lg:text-7xl font-bold",
  },
  // ... more
}
```

#### 2. **Colors**
Edit all colors used throughout the site:
```typescript
colors: {
  text1: "#1a1a1a",        // Primary text
  text2: "#666666",        // Secondary text
  background1: "#ffffff",  // Primary background
  background2: "#f8f9fa",  // Secondary background
  background3: "#e9ecef",  // Tertiary background
  accent1: "#ff6b6b",      // Primary accent
  accent2: "#4ecdc4",      // Secondary accent
  accent3: "#ffe66d",      // Tertiary accent
}
```

#### 3. **Buttons**
Customize button styles and App Store buttons:
```typescript
buttons: {
  primary: {
    className: "px-8 py-4 rounded-full ...",
  },
  appStore: {
    // App Store button config
  }
}
```

#### 4. **Icons**
Change all icons (currently using emojis, easily replaceable with icon libraries):
```typescript
icons: {
  apple: "🍎",
  googlePlay: "📱",
  // ... more
}
```

#### 5. **Content**
Edit all text content:
- Fixed section (logo, tagline, description, CTAs)
- 5 Hero sections (title, subtitle, description, icon, gradient)
- Footer (copyright, links, social media)

## 📱 Responsive Breakpoints

- **Desktop** (1280px+): Split layout with fixed left section (40%) and scrollable right section (60%)
- **Tablet** (800px-1279px): Stacked scrollable sections
- **Mobile** (1px-799px): Stacked scrollable sections (narrower)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main landing page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/
│   │   ├── Text.tsx      # Reusable text component
│   │   ├── Button.tsx    # Reusable button components
│   │   └── Icon.tsx      # Reusable icon component
│   └── Footer.tsx        # Footer component
└── config/
    └── site.config.ts    # ⭐ EDIT THIS FILE FOR ALL CUSTOMIZATION
```

## 🎯 Key Features

- ✅ Fully responsive design
- ✅ Centralized configuration
- ✅ Modern UI with smooth animations
- ✅ Custom scrollbar (desktop)
- ✅ App Store download buttons
- ✅ Easy to customize colors, text, and styling
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for utility-first styling

## 💡 Tips

1. **To change colors**: Edit `colors` in `site.config.ts`
2. **To change text content**: Edit `fixedSection`, `heroSections`, or `footer` in `site.config.ts`
3. **To add more hero sections**: Add objects to the `heroSections` array
4. **To integrate icon libraries** (like react-icons): Install the library and replace emoji strings in the `icons` object

## 📝 License

All rights reserved.

