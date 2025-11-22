# 📁 Assets Folder - Image Storage Guide

This folder is where you store all your website images. The structure is organized by category to make it easy to find and manage your pictures.

## ⚠️ Important Note About .gitkeep Files

You will see `.gitkeep` files in each folder - **IGNORE THESE!** They are just placeholder files to keep empty folders in git. 

**DO THIS:**
- ✅ Paste your pictures **directly in the folder** (e.g., `collections/modern/my-picture.jpg`)
- ✅ The picture should be in the same folder as `.gitkeep`, not inside it

**DON'T DO THIS:**
- ❌ Don't open `.gitkeep` file
- ❌ Don't paste pictures inside `.gitkeep` file
- ❌ Just paste in the folder itself!

## 📂 Folder Organization

### Collections
For wallpaper collections:
- `collections/modern/` - Modern style wallpapers
- `collections/classic/` - Classic/traditional wallpapers
- `collections/luxury/` - Luxury/premium wallpapers
- `collections/custom/` - Custom design wallpapers

### Kids
For children's room wallpapers:
- `kids/nursery/` - Baby room wallpapers (0-2 years)
- `kids/toddlers/` - Toddler room wallpapers (2-5 years)
- `kids/teens/` - Teen room wallpapers (13+ years)
- `kids/educational/` - Educational/learning wallpapers

### 3D Wallpapers
For 3D effect wallpapers:
- `3d/geometric/` - Geometric 3D patterns
- `3d/nature/` - Nature-themed 3D designs
- `3d/abstract/` - Abstract 3D art
- `3d/luxury/` - Luxury 3D designs

### Stickers
For room stickers:
- `stickers/kids/` - Kids-themed stickers
- `stickers/decorative/` - Decorative stickers
- `stickers/quotes/` - Quote/motivational stickers
- `stickers/shapes/` - Shape/pattern stickers

### Colors
For color-based wallpapers:
- `colors/` - All color wallpapers (red, blue, green, etc.)

## 🚀 Quick Start

1. **Find your image** on your computer
2. **Copy it** (Ctrl+C)
3. **Paste it** into the appropriate folder above
4. **Follow the guide** in `HOW_TO_ADD_IMAGES.md` to add it to your website

## 📝 Naming Tips

- Use descriptive names: `modern-blue-geometric.jpg` ✅
- Avoid generic names: `image1.jpg` ❌
- Use lowercase and hyphens: `kids-nursery-1.jpg` ✅
- Avoid spaces: `my wallpaper.jpg` ❌ (use `my-wallpaper.jpg` instead)

## 🔍 Image Requirements

- **Formats**: JPG, PNG, WebP, GIF
- **Size**: Keep under 2MB for fast loading
- **Aspect Ratio**: Portrait (height > width) works best
- **Resolution**: 800x1200px or higher recommended

## 💡 Example

To add a modern collection wallpaper:

1. Copy `my-wallpaper.jpg` to `collections/modern/`
2. In `ProductGallery.tsx`, add:
   ```javascript
   import myWallpaper from "@/assets/collections/modern/my-wallpaper.jpg";
   ```
3. Use it in your wallpaper data:
   ```javascript
   { id: 1, name: "My Wallpaper", category: "Modern", color: "Blue", pageType: "collections", image: myWallpaper }
   ```

## 📚 More Help

See `HOW_TO_ADD_IMAGES.md` in the project root for detailed step-by-step instructions.

---

**Remember**: All folders are ready! Just copy your images here and import them in the code. 🎨

