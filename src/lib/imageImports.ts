/**
 * Easy Image Import Utility
 * 
 * This utility helps you easily import images from your assets folder.
 * Just copy your images to the appropriate folder and use the getImagePath function.
 */

// Type for image path (can be string URL or imported image)
export type ImageSource = string | { default: string };

/**
 * Get image path from assets folder
 * 
 * @param category - The category folder (collections, kids, 3d, stickers, colors)
 * @param subfolder - Optional subfolder within category
 * @param filename - The image filename (e.g., "wallpaper-1.jpg")
 * @returns The path to the image
 * 
 * @example
 * // For collections/modern/wallpaper-1.jpg
 * getImagePath("collections", "modern", "wallpaper-1.jpg")
 * 
 * // For colors/blue-wallpaper.jpg
 * getImagePath("colors", undefined, "blue-wallpaper.jpg")
 */
export function getImagePath(
  category: "collections" | "kids" | "3d" | "stickers" | "colors",
  subfolder: string | undefined,
  filename: string
): string {
  if (subfolder) {
    return `/src/assets/${category}/${subfolder}/${filename}`;
  }
  return `/src/assets/${category}/${filename}`;
}

/**
 * Import image using Vite's dynamic import
 * This allows you to easily add images without manual imports
 * 
 * @param path - Full path to the image from src/assets
 * @returns Promise that resolves to the image URL
 */
export async function importImage(path: string): Promise<string> {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module.default || path;
  } catch (error) {
    console.warn(`Failed to import image: ${path}`, error);
    return path;
  }
}

/**
 * Helper function to get all images from a folder
 * Uses Vite's import.meta.glob for dynamic imports
 * 
 * @param pattern - Glob pattern for images (e.g., "/src/assets/collections/modern/*.{jpg,jpeg,png}")
 * @returns Object with image paths as keys
 */
export function getImagesFromFolder(pattern: string): Record<string, () => Promise<{ default: string }>> {
  return import.meta.glob(pattern, { eager: false });
}

/**
 * Pre-configured image getters for common categories
 */
export const imageHelpers = {
  collections: {
    modern: (filename: string) => new URL(`../../assets/collections/modern/${filename}`, import.meta.url).href,
    classic: (filename: string) => new URL(`../../assets/collections/classic/${filename}`, import.meta.url).href,
    luxury: (filename: string) => new URL(`../../assets/collections/luxury/${filename}`, import.meta.url).href,
    custom: (filename: string) => new URL(`../../assets/collections/custom/${filename}`, import.meta.url).href,
  },
  kids: {
    nursery: (filename: string) => new URL(`../../assets/kids/nursery/${filename}`, import.meta.url).href,
    toddlers: (filename: string) => new URL(`../../assets/kids/toddlers/${filename}`, import.meta.url).href,
    teens: (filename: string) => new URL(`../../assets/kids/teens/${filename}`, import.meta.url).href,
    educational: (filename: string) => new URL(`../../assets/kids/educational/${filename}`, import.meta.url).href,
  },
  "3d": {
    geometric: (filename: string) => new URL(`../../assets/3d/geometric/${filename}`, import.meta.url).href,
    nature: (filename: string) => new URL(`../../assets/3d/nature/${filename}`, import.meta.url).href,
    abstract: (filename: string) => new URL(`../../assets/3d/abstract/${filename}`, import.meta.url).href,
    luxury: (filename: string) => new URL(`../../assets/3d/luxury/${filename}`, import.meta.url).href,
  },
  stickers: {
    kids: (filename: string) => new URL(`../../assets/stickers/kids/${filename}`, import.meta.url).href,
    decorative: (filename: string) => new URL(`../../assets/stickers/decorative/${filename}`, import.meta.url).href,
    quotes: (filename: string) => new URL(`../../assets/stickers/quotes/${filename}`, import.meta.url).href,
    shapes: (filename: string) => new URL(`../../assets/stickers/shapes/${filename}`, import.meta.url).href,
  },
  colors: (filename: string) => new URL(`../../assets/colors/${filename}`, import.meta.url).href,
};

/**
 * Simple way to import an image - just provide the relative path from src/assets
 * 
 * @example
 * importImageSimple("collections/modern/wallpaper-1.jpg")
 * importImageSimple("colors/blue-pattern.jpg")
 */
export function importImageSimple(path: string): string {
  // For Vite, we use direct imports
  // This function is mainly for documentation - actual imports should be done with:
  // import myImage from "@/assets/path/to/image.jpg"
  return `@/assets/${path}`;
}

