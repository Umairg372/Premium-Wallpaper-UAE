import manifest from '../image-manifest.json';

// Color detection from filename
const colorKeywords: Record<string, string> = {
  'red': 'Red', 'crimson': 'Red', 'ruby': 'Red',
  'blue': 'Blue', 'navy': 'Blue', 'ocean': 'Blue', 'sky': 'Blue',
  'green': 'Green', 'emerald': 'Green', 'forest': 'Green', 'sage': 'Green',
  'pink': 'Pink', 'rose': 'Pink', 'blush': 'Pink',
  'yellow': 'Yellow', 'gold': 'Gold', 'sunshine': 'Yellow',
  'purple': 'Purple', 'lavender': 'Purple', 'royal': 'Purple',
  'gray': 'Gray', 'grey': 'Gray', 'silver': 'Gray', 'concrete': 'Gray',
  'white': 'White', 'ivory': 'White', 'pearl': 'White',
  'brown': 'Brown', 'chocolate': 'Brown', 'wood': 'Brown',
};

// Default colors per category
const defaultColors: Record<string, string> = {
  'Modern': 'Gray',
  'Classic': 'Brown',
  'Luxury': 'Gold',
  'Custom': 'Blue',
  'Nursery': 'Blue',
  'Toddlers': 'Yellow',
  'Teens': 'Blue',
  'Educational': 'Green',
  '3D Geometric': 'Gray',
  '3D Nature': 'Green',
  '3D Abstract': 'Purple',
  '3D Luxury': 'Gold',
  'Kids Stickers': 'Yellow',
  'Decorative Stickers': 'Green',
  'Quote Stickers': 'Blue',
  'Shape Stickers': 'Yellow',
};

/**
 * Extract color from filename
 */
function extractColor(filename: string): string {
  const lower = filename.toLowerCase();
  for (const [keyword, color] of Object.entries(colorKeywords)) {
    if (lower.includes(keyword)) {
      return color;
    }
  }
  return 'Blue'; // default
}

/**
 * Generate a readable name from filename
 */
function generateName(filename: string, category: string): string {
  // Remove extension
  let name = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
  
  // Replace common separators with spaces
  name = name.replace(/[-_()]/g, ' ');
  
  // Remove numbers in parentheses like "(1)" or "(2)"
  name = name.replace(/\s*\(\d+\)\s*/g, ' ');
  
  // Capitalize words
  name = name.split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .filter(word => word.length > 0)
    .join(' ');
  
  // If name is too generic, add category
  if (name.length < 3 || name.toLowerCase() === 'download' || name.toLowerCase() === 'image') {
    name = `${category} Design`;
  }
  
  return name || `${category} Wallpaper`;
}


export async function loadAllImages(): Promise<Array<{
  id: number;
  name: string;
  category: string;
  color: string;
  pageType: 'collections' | 'kids' | 'colors' | '3d' | 'stickers';
  image: string;
}>> {
  const allImages: Array<any> = [];
  let idCounter = 0;

  for (const imagePath of manifest) {
    const pathParts = imagePath.split('/');
    const filename = pathParts[pathParts.length - 1];

    if (filename.startsWith('.') || filename.includes('README') || filename.includes('STEP') || filename.includes('QUICK_START') || filename.includes('YAHAN')) {
      continue;
    }

    let pageType: any = 'general';
    let category = 'General';

    if (pathParts.length > 2) {
        pageType = pathParts[1];
    }
    if (pathParts.length > 3) {
        category = pathParts[2];
    }

    const name = generateName(filename, category);
    const color = extractColor(filename) || defaultColors[category] || 'Blue';

    // We probably don't want to show images from the root of assets in the product gallery
    if (pageType === 'general') {
        continue;
    }

    allImages.push({
      id: idCounter++,
      name,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      color,
      pageType,
      image: `/${imagePath}`
    });
  }

  return allImages;
}
