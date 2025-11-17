# Images Folder

## Current Assets

### ✅ logo.png
Your company logo - displays on the left side (desktop) or top (mobile/tablet)

### ✅ app-store-badge.svg
Official Apple App Store download badge

## Logo Specifications

- **Current file:** `logo.png`
- **Recommended format:** PNG or SVG (SVG preferred for scalability)
- **Recommended size:** At least 512x512px for PNG
- **Background:** Transparent recommended
- **Aspect Ratio:** Square or wide (1:1 or 2:1)

## To Update Your Logo

Simply replace `logo.png` with your new logo file (keep the same filename).

If you want to use a different filename or format:
1. Add your logo file to this folder
2. Update `src/config/site.config.ts`:

```typescript
fixedSection: {
  logo: {
    image: "/images/YOUR_LOGO_FILENAME.png"  // Update this
  }
}
```

## App Store Badge

The `app-store-badge.svg` is the official Apple App Store badge. To change the download link, edit the href in `src/app/page.tsx` or add it to the config file.

