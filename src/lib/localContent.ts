export type LocalWallpaperItem = {
  id: number;
  name: string;
  category: string;
  color: string;
  pageType: 'collections' | 'kids' | 'colors' | '3d' | 'stickers';
  image: string;
};

export function getLocalAppGallery(): LocalWallpaperItem[] {
  const modules = import.meta.glob(
    '@/assets/local/app-gallery/*.{jpg,jpeg,png,webp,gif}',
    { eager: true } as any
  ) as Record<string, { default: string }>;

  const items: LocalWallpaperItem[] = Object.entries(modules).map(
    ([path, mod], index) => {
      const fileName = path.split('/').pop() || `Image ${index + 1}`;
      const baseName = fileName.replace(/\.[^.]+$/, '');
      return {
        id: 50000 + index,
        name: baseName,
        category: 'App Gallery',
        color: 'Gray',
        pageType: 'collections',
        image: mod.default,
      };
    }
  );

  return items;
}

// Curated real wallpaper photos per tab (royalty-free Unsplash CDN)
let curatedId = 60000;

export function getCuratedCollections(): LocalWallpaperItem[] {
  const data = [
    ["Modern", "Blue", "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop"],
    ["Modern", "Gray", "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=800&auto=format&fit=crop"],
    ["Classic", "Pink", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop"],
    ["Classic", "Brown", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop"],
    ["Luxury", "Gold", "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&auto=format&fit=crop"],
    ["Luxury", "White", "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&auto=format&fit=crop"],
    ["Custom", "Green", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop"],
    ["Custom", "Blue", "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&auto=format&fit=crop"],
    ["Modern", "Beige", "https://images.unsplash.com/photo-1576656894633-c6972eda7842?w=800&auto=format&fit=crop"],
    ["Classic", "Cream", "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800&auto=format&fit=crop"]
  ];
  return data.map(([category, color, image]) => ({
    id: curatedId++,
    name: `${category} ${color} Wallpaper`,
    category: category as string,
    color: color as string,
    pageType: 'collections',
    image: image as string,
  }));
}

export function getCuratedKids(): LocalWallpaperItem[] {
  const data = [
    ["Nursery", "Blue", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop"],
    ["Nursery", "Pink", "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&auto=format&fit=crop"],
    ["Toddlers", "Green", "https://images.unsplash.com/photo-1503457574462-bca3c5a33f5a?w=800&auto=format&fit=crop"],
    ["Teens", "Red", "https://images.unsplash.com/photo-1559615881-3de67b8b4bcd?w=800&auto=format&fit=crop"],
    ["Educational", "Yellow", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop"],
  ];
  return data.map(([category, color, image]) => ({
    id: curatedId++,
    name: `Kids ${category} ${color}`,
    category: category as string,
    color: color as string,
    pageType: 'kids',
    image: image as string,
  }));
}

export function getCurated3D(): LocalWallpaperItem[] {
  const data = [
    ["3D Geometric", "Gray", "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop"],
    ["3D Geometric", "Blue", "https://images.unsplash.com/photo-1555343525-5d1b4371d0dd?w=800&auto=format&fit=crop"],
    ["3D Abstract", "Purple", "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop"],
    ["3D Nature", "Green", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop"],
    ["3D Luxury", "Gold", "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop"],
  ];
  return data.map(([category, color, image]) => ({
    id: curatedId++,
    name: `${category} ${color}`,
    category: category as string,
    color: color as string,
    pageType: '3d',
    image: image as string,
  }));
}

export function getCuratedStickers(): LocalWallpaperItem[] {
  const data = [
    ["Kids Stickers", "Yellow", "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop"],
    ["Decorative Stickers", "Pink", "https://images.unsplash.com/photo-1520975954732-35dd222996c3?w=800&auto=format&fit=crop"],
    ["Quote Stickers", "Blue", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop"],
    ["Shape Stickers", "Red", "https://images.unsplash.com/photo-1509223197845-458d87318791?w=800&auto=format&fit=crop"],
  ];
  return data.map(([category, color, image]) => ({
    id: curatedId++,
    name: `${category}`,
    category: category as string,
    color: color as string,
    pageType: 'stickers',
    image: image as string,
  }));
}

export function getCuratedColors(): LocalWallpaperItem[] {
  const colors = ["Red","Blue","Green","Pink","Yellow","Purple","Gray","White","Brown","Gold"];
  const images = {
    Red: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=800&auto=format&fit=crop",
    Blue: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    Green: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&auto=format&fit=crop",
    Pink: "https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?w=800&auto=format&fit=crop",
    Yellow: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&auto=format&fit=crop",
    Purple: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop",
    Gray: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&auto=format&fit=crop",
    White: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&auto=format&fit=crop",
    Brown: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop",
    Gold: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&auto=format&fit=crop",
  } as Record<string,string>;
  const out: LocalWallpaperItem[] = [];
  for (const c of colors) {
    out.push({
      id: curatedId++,
      name: `${c} Wallpaper`,
      category: c,
      color: c,
      pageType: 'colors',
      image: images[c],
    });
  }
  return out;
}

export function getCuratedAppGallery(): LocalWallpaperItem[] {
  // Use Collections-type entries for neutral gallery
  return getCuratedCollections();
}


