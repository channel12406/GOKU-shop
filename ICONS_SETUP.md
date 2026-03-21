# 🎮 Game Icons Setup Guide

## Instructions for Adding Game Icons

To make your recharge page look professional with actual game icons instead of emojis, follow these steps:

### 1. Create the Icons Folder

Create a new folder in your assets directory:
```
src/assets/game-icons/
```

### 2. Prepare Your Icon Files

Make sure your icon images are:
- **Format**: PNG (recommended) or SVG
- **Size**: 512x512 pixels minimum (or vector SVG)
- **Background**: Transparent background preferred
- **Quality**: High resolution for crisp display

### 3. Name Your Files

Use these exact filenames for automatic integration:

| Game | Filename |
|------|----------|
| Free Fire | `free-fire-icon.png` |
| Call of Duty Mobile | `cod-icon.png` |
| PUBG Mobile | `pubg-icon.png` |
| Roblox | `roblox-icon.png` |
| Blood Strike | `blood-strike-icon.png` |
| Mobile Legends | `mobile-legends-icon.png` |
| Genshin Impact | `genshin-icon.png` |

### 4. Update the Code

In `src/lib/games.ts`, update the `iconImage` paths for each game:

```typescript
{
  id: "freefire",
  name: "Free Fire",
  icon: "🔥",
  iconImage: "/src/assets/game-icons/free-fire-icon.png", // ✅ Your path here
  gradient: "from-orange-500 to-red-600",
  description: "Diamonds recharge for Free Fire",
  popular: true,
}
```

### 5. Alternative: Use Public Folder

If you prefer to use the public folder instead:

1. Place icons in: `public/game-icons/`
2. Update paths to: `/game-icons/free-fire-icon.png`
3. No need for `/src/` prefix

### 6. Fallback System

The code includes an automatic fallback system:
- If the image fails to load → Shows the emoji icon
- If no image path is set → Shows the emoji icon
- Smooth transition between states

### 7. Testing

After adding your icons:
1. Save all files
2. The dev server will auto-reload
3. Visit `/recharge` to see your professional game selector
4. Check that all icons display correctly

### Example File Structure

```
pixalium-digital-launch/
├── src/
│   ├── assets/
│   │   ├── game-icons/
│   │   │   ├── free-fire-icon.png
│   │   │   ├── cod-icon.png
│   │   │   ├── roblox-icon.png
│   │   │   └── blood-strike-icon.png
│   │   └── hero-image.jpg
│   └── ...
└── ...
```

### Tips for Best Results

✨ **Consistent Style**: Use icons with similar visual style
🎨 **Brand Colors**: Match official game brand colors when possible
📐 **Same Dimensions**: Keep all icons at identical dimensions
🖼️ **Optimize Size**: Compress images for faster loading (< 50KB each)
⚡ **SVG Format**: Consider SVG for perfect scaling at any size

### Where to Get Icons

- Official game websites (press kits)
- Game store pages (Google Play, App Store)
- Icon repositories (Icons8, Flaticon, etc.)
- Design resources (Freepik, PNGEgg)

---

**Note**: The website works perfectly with emojis as fallback. Adding real icons is purely for enhanced professional appearance! 🎯
