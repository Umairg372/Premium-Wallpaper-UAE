import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Heart, RefreshCw } from "lucide-react";
import premiumWallpaper from "@/assets/premium-wallpaper.jpg";

import { loadAllImages } from "@/lib/autoImageLoader";
import { getWallpapers } from "@/lib/api";

interface ProductGalleryProps {
  categories: string[];
  title: string;
  isKidsTheme?: boolean;
  pageType?: 'collections' | 'kids' | 'colors' | '3d' | 'stickers' | 'all' | 'videos';
  itemsOverride?: Array<{
    id: number;
    name: string;
    category: string;
    color: string;
    pageType: 'collections' | 'kids' | '3d' | 'stickers' | 'colors';
    image: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    mediumUrl?: string;
    webpUrl?: string;
    width?: number;
    height?: number;
  }>;
}

const ProductGallery = ({ categories, title, isKidsTheme = false, pageType = 'collections', itemsOverride }: ProductGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [allWallpapers, setAllWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedWallpapers, setLikedWallpapers] = useState<Set<number>>(new Set());

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      console.log(`[ProductGallery] Fetching wallpapers for pageType: ${pageType}`);
      const apiWallpapers = await getWallpapers({ pageType: pageType });
      console.log(`[ProductGallery] API returned ${apiWallpapers.length} wallpapers for pageType: ${pageType}`);
      // Transform API response to match expected format
      const transformed = apiWallpapers.map(w => ({
        id: w.id,
        name: w.name,
        category: w.category,
        color: w.color,
        pageType: w.pageType,
        image: w.imageUrl,
        videoUrl: w.videoUrl,
        thumbnailUrl: w.thumbnailUrl,
        mediumUrl: w.mediumUrl,
        webpUrl: w.webpUrl,
        width: w.width,
        height: w.height,
      }));
      console.log(`[ProductGallery] Transformed wallpapers:`, transformed);
      setAllWallpapers(transformed);
    } catch (error) {
      // Fallback to file system if API fails
      console.warn('API fetch failed, falling back to file system:', error);
      try {
        const images = await loadAllImages();
        console.log(`[ProductGallery] File system returned ${images.length} images`);
        setAllWallpapers(images);
      } catch (fsError) {
        console.error('File system load also failed:', fsError);
        setAllWallpapers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!itemsOverride) {
      fetchImages();
    } else {
      setAllWallpapers(itemsOverride);
      setLoading(false);
    }
  }, [itemsOverride, pageType]);

  // Use memoized wallpapers to avoid re-computing on every render
  const pageWallpapers = useMemo(() => {
    console.log(`[ProductGallery] Memoizing wallpapers - itemsOverride: ${!!itemsOverride}, total allWallpapers: ${allWallpapers.length}, pageType: ${pageType}`);
    if (Array.isArray(itemsOverride) && itemsOverride.length > 0) {
      console.log(`[ProductGallery] Using itemsOverride: ${itemsOverride.length} items`);
      return itemsOverride;
    }
    let filtered;
    if (pageType === 'all') {
      // Show all wallpapers when pageType is 'all'
      filtered = allWallpapers;
    } else {
      // Filter by specific pageType
      filtered = allWallpapers.filter(wallpaper => {
        const matches = wallpaper.pageType === pageType;
        return matches;
      });
    }
    console.log(`[ProductGallery] Filtered wallpapers: ${filtered.length} for pageType: ${pageType}`);
    return filtered;
  }, [itemsOverride, pageType, allWallpapers]);
  
  const filteredWallpapers = selectedCategory === "All"
    ? pageWallpapers
    : pageWallpapers.filter(wallpaper =>
        wallpaper.category === selectedCategory ||
        wallpaper.color === selectedCategory
      );

  console.log(`[ProductGallery] Final filtered wallpapers: ${filteredWallpapers.length} for category: ${selectedCategory} (from ${pageWallpapers.length} page wallpapers)`);
  
  const isDevelopment = import.meta.env.DEV;

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground">Browse our premium wallpaper collection</p>
        {isDevelopment && (
          <Button onClick={fetchImages} variant="outline" size="sm" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Images
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          onClick={() => setSelectedCategory("All")}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading wallpapers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredWallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                style={{
                  paddingBottom: '100%', // Fixed square aspect ratio (1:1)
                  position: 'relative',
                  height: 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', maxHeight: '400px' }}>
                  {wallpaper.videoUrl ? (
                    <video
                      src={wallpaper.videoUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        console.warn(`Video failed to load: ${wallpaper.videoUrl}`, e);
                        // If video fails to load, show a fallback image
                        if (e.currentTarget.parentNode) {
                          const img = document.createElement('img');
                          img.src = wallpaper.thumbnailUrl || wallpaper.mediumUrl || wallpaper.imageUrl || premiumWallpaper;
                          img.alt = wallpaper.name;
                          img.className = 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500';
                          img.referrerPolicy = 'no-referrer';
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentNode.appendChild(img);
                        }
                      }}
                    >
                      <source src={wallpaper.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <picture>
                      {wallpaper.webpUrl && <source srcSet={wallpaper.webpUrl} type="image/webp" />}
                      <img
                        src={wallpaper.mediumUrl || wallpaper.thumbnailUrl || wallpaper.imageUrl || wallpaper.image || premiumWallpaper}
                        srcSet={`${wallpaper.thumbnailUrl ? `${wallpaper.thumbnailUrl} 200w,` : ''} ${wallpaper.mediumUrl ? `${wallpaper.mediumUrl} 800w,` : ''} ${wallpaper.imageUrl ? `${wallpaper.imageUrl} 1200w` : ''}`}
                        sizes="(max-width: 640px) 200px, (max-width: 1024px) 400px, 800px"
                        alt={wallpaper.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          console.warn(`Main image failed to load: ${wallpaper.imageUrl || wallpaper.thumbnailUrl || wallpaper.mediumUrl}`, e);
                          if (e.currentTarget.src !== premiumWallpaper) {
                            e.currentTarget.src = premiumWallpaper;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </picture>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => setSelectedProduct(wallpaper)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="aspect-square">
                              {wallpaper.videoUrl ? (
                                <video
                                  src={wallpaper.videoUrl}
                                  controls
                                  autoPlay
                                  loop
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    console.warn(`Dialog video failed to load: ${wallpaper.videoUrl}`, e);
                                    // If video fails to load, show a fallback image
                                    if (e.currentTarget.parentNode) {
                                      const img = document.createElement('img');
                                      img.src = wallpaper.thumbnailUrl || wallpaper.mediumUrl || wallpaper.imageUrl || premiumWallpaper;
                                      img.alt = wallpaper.name;
                                      img.className = 'w-full h-full object-cover rounded-lg';
                                      img.referrerPolicy = 'no-referrer';
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentNode.appendChild(img);
                                    }
                                  }}
                                >
                                  <source src={wallpaper.videoUrl} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <picture>
                                  {wallpaper.webpUrl && <source srcSet={wallpaper.webpUrl} type="image/webp" />}
                                  <img
                                    src={wallpaper.mediumUrl || wallpaper.thumbnailUrl || wallpaper.imageUrl || wallpaper.image || premiumWallpaper}
                                    alt={wallpaper.name}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                          console.warn(`Main image failed to load: ${wallpaper.imageUrl || wallpaper.thumbnailUrl || wallpaper.mediumUrl}`, e);
                          e.currentTarget.src = premiumWallpaper;
                        }}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </picture>
                              )}
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold">{wallpaper.name}</h3>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{wallpaper.category}</Badge>
                                <Badge variant="outline">{wallpaper.color}</Badge>
                              </div>
                              <p className="text-muted-foreground">
                                Premium quality wallpaper perfect for {wallpaper.category.toLowerCase()} spaces.
                                Available in multiple sizes and finishes.
                              </p>
                              <Button className="w-full">
                                Get Quote
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        className={`bg-white/90 hover:bg-white ${likedWallpapers.has(wallpaper.id) ? 'text-red-500' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedWallpapers(prev => {
                            const newLiked = new Set(prev);
                            if (newLiked.has(wallpaper.id)) {
                              newLiked.delete(wallpaper.id);
                            } else {
                              newLiked.add(wallpaper.id);
                            }
                            return newLiked;
                          });
                        }}
                      >
                        <Heart className={`h-4 w-4 ${likedWallpapers.has(wallpaper.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{wallpaper.name}</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{wallpaper.category}</Badge>
                  <Badge variant="outline" className="text-xs">{wallpaper.color}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Premium Quality</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredWallpapers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No wallpapers found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
