# 🎨 Quick Customization Guide

## Edit Everything in One File: `src/config/site.config.ts`

---

## 🎨 Your Current Color Scheme

```typescript
colors: {
  text1: "#ffffff",        // Primary text (WHITE)
  text2: "#000000",        // Secondary text (BLACK)
  background1: "#ffffff",  // Primary background (WHITE)
  background2: "#FF7a25",  // Secondary background (ORANGE)
  accent1: "#FE3a08",      // Primary accent (RED-ORANGE)
  accent2: "#fd2b05",      // Secondary accent (RED)
  accent3: "#f92417",      // Tertiary accent (BRIGHT RED)
}
```

---

## 🖼️ Logo Setup

### Where to put your logo:
**Folder:** `public/images/`  
**Filename:** `logo.png` or `logo.svg`

### After adding your logo:
1. Save your logo as `public/images/logo.png`
2. It will automatically show up! (Already configured)

**Current config:**
```typescript
logo: {
  text: "CraveFood",
  emoji: "🍽️",              // Shows if no image
  image: "/images/logo.png", // Your logo path
}
```

---

## ✏️ Fonts

**Current font:** Barlow Condensed (similar to Enduro)

To change fonts:
1. Browse fonts at [Google Fonts](https://fonts.google.com)
2. Update `src/app/layout.tsx` with your chosen font

---

## 📱 App Store Button

**Currently showing:** iOS App Store only (Android removed per your request)

To change the App Store link:
```typescript
// In src/app/page.tsx, find:
<AppStoreButton platform="apple" href="YOUR_APP_STORE_LINK_HERE" />
```

---

## 📝 Quick Edits Checklist

### Change Company Name
```typescript
fixedSection: {
  logo: {
    text: "CraveFood", // ← Change this
  }
}
```

### Change Tagline
```typescript
fixedSection: {
  tagline: "Delicious food delivered to your doorstep", // ← Change this
}
```

### Change Button Text
```typescript
fixedSection: {
  cta: {
    primary: "Order Now",      // ← Change this
    secondary: "Learn More",   // ← Change this
  }
}
```

### Edit Hero Sections
```typescript
heroSections: [
  {
    id: 1,
    title: "Wide Selection",           // ← Main title
    subtitle: "Thousands of Restaurants", // ← Subtitle
    description: "Choose from...",     // ← Description
    icon: "🍔",                        // ← Icon/Emoji
    bgGradient: "from-orange-400 to-red-500", // ← Background gradient
  },
  // ... 4 more sections
]
```

### Add More Hero Sections
Just copy one section and change the `id`:
```typescript
{
  id: 6, // New section!
  title: "Your New Feature",
  subtitle: "Amazing Benefit",
  description: "Tell them why this matters",
  icon: "🚀",
  bgGradient: "from-purple-400 to-pink-500",
},
```

---

## 🎨 Tailwind Gradients Reference

Popular gradient combinations for hero sections:
- `from-orange-400 to-red-500` (warm)
- `from-blue-400 to-purple-500` (cool)
- `from-green-400 to-teal-500` (fresh)
- `from-pink-400 to-rose-500` (vibrant)
- `from-yellow-400 to-orange-500` (energetic)
- `from-indigo-400 to-blue-500` (professional)
- `from-red-400 to-pink-500` (bold)

---

## 🚀 Run Your Site

```bash
npm install  # First time only
npm run dev  # Start development server
```

Visit: `http://localhost:3000`

---

## 📦 Deploy to Production

```bash
npm run build
npm start
```

---

**Need help?** All settings are in `src/config/site.config.ts` with comments! 🎉

