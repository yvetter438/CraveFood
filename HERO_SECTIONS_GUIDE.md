# 🎯 Hero Sections Setup Complete!

## 📋 Overview

Your landing page now has 5 hero sections with alternating layouts and mockup image support.

---

## 🎨 Hero Section Breakdown

### Hero 1: "Your food-first video app"
- **Content:** Discover & Share Food Content
- **Icon:** 🎬
- **Gradient:** Orange to Red
- **Layout:** Text LEFT, Image RIGHT
- **Mockup:** `/images/hero-mockups/hero-1-app-mockup.png`
- **Purpose:** Introduce the main app concept

### Hero 2: "Cravin Something?"
- **Content:** Find It in Seconds
- **Icon:** 😋
- **Gradient:** Purple to Pink
- **Layout:** Text RIGHT, Image LEFT (oppositely symmetrical)
- **Mockup:** `/images/hero-mockups/hero-2-user-demo.png`
- **Purpose:** Show user interaction/video mockup

### Hero 3: "Connect With Foodies"
- **Content:** Share, Chat & Discover Together
- **Icon:** 💬
- **Gradient:** Blue to Cyan
- **Layout:** Text LEFT, Image RIGHT
- **Mockup:** `/images/hero-mockups/hero-3-social.png`
- **Purpose:** Highlight social/chat features

### Hero 4: "Trusted by Top Restaurants"
- **Content:** Join Thousands of Food Businesses
- **Icon:** 🏪
- **Gradient:** Green to Emerald
- **Layout:** Text RIGHT, Image LEFT
- **Mockup:** `/images/hero-mockups/hero-4-restaurants.png`
- **Purpose:** Restaurant social proof

### Hero 5: "Restaurant Partners"
- **Content:** Grow Your Business with Crave
- **Icon:** 🤝
- **Gradient:** Yellow to Orange
- **Layout:** Text LEFT, Image RIGHT
- **Mockup:** `/images/hero-mockups/hero-5-partner.png`
- **Purpose:** Restaurant onboarding/partnership info

---

## 📂 Where to Upload Mockups

**Folder:** `/public/images/hero-mockups/`

Upload your mockup images with these exact filenames:
1. `hero-1-app-mockup.png`
2. `hero-2-user-demo.png`
3. `hero-3-social.png`
4. `hero-4-restaurants.png`
5. `hero-5-partner.png`

---

## 🎯 Layout Pattern

The sections alternate in a visually appealing pattern:

```
Hero 1: [Text]          [Image]
Hero 2: [Image]         [Text]   ← Oppositely symmetrical
Hero 3: [Text]          [Image]
Hero 4: [Image]         [Text]
Hero 5: [Text]          [Image]
```

---

## 📱 Responsive Design

### Desktop (1280+)
- Split screen layout with text and image side-by-side
- Alternating layouts for visual interest
- Full mockup visibility

### Tablet & Mobile (1-1279px)
- Stacked layout (text above, image below)
- Centered content
- Smaller mockup containers

---

## ✏️ How to Edit Content

All hero section content is in: `src/config/site.config.ts`

```typescript
heroSections: [
  {
    id: 1,
    title: "Your food-first video app",          // Main headline
    subtitle: "Discover & Share Food Content",    // Subheadline
    description: "Full description here...",      // Paragraph text
    icon: "🎬",                                   // Emoji icon
    bgGradient: "from-orange-400 to-red-500",    // Tailwind gradient
    mockupImage: "/images/hero-mockups/...",     // Image path
    layout: "image-right",                        // or "image-left"
  },
  // ... more sections
]
```

---

## 🎨 Mockup Container Styling

All mockup images appear in beautiful phone-shaped containers:
- **Aspect Ratio:** 9:16 (portrait)
- **Border:** Rounded corners with white border
- **Effect:** Shadow and backdrop blur
- **Fallback:** Shows icon + upload instructions if no image

---

## 🚀 Next Steps

1. ✅ Hero sections are configured
2. 📸 Upload your 5 mockup images to `/public/images/hero-mockups/`
3. 🎨 Customize text in `src/config/site.config.ts`
4. 🏃 Run `npm run dev` to see your changes

---

## 💡 Pro Tips

- Use consistent mockup styles across all heroes
- Ensure mockups are 9:16 ratio (phone screen)
- Keep file sizes under 2MB for fast loading
- Use PNG for transparency or JPG for photos
- Tools: Figma, Sketch, Canva, or mockup generators

---

**Everything is ready! Just add your mockup images and you're good to go!** 🎉

