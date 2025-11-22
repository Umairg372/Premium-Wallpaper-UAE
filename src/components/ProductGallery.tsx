import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Heart, RefreshCw } from "lucide-react";
import premiumWallpaper from "@/assets/premium-wallpaper.jpg";

import { loadAllImages } from "@/lib/autoImageLoader";

interface ProductGalleryProps {
  categories: string[];
  title: string;
  isKidsTheme?: boolean;
  pageType?: 'collections' | 'kids' | 'colors' | '3d' | 'stickers';
  itemsOverride?: Array<{ id: number; name: string; category: string; color: string; pageType: ProductGalleryProps['pageType']; image: string }>;
}

const ProductGallery = ({ categories, title, isKidsTheme = false, pageType = 'collections', itemsOverride }: ProductGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [allWallpapers, setAllWallpapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    const images = await loadAllImages();
    setAllWallpapers(images);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Use memoized wallpapers to avoid re-computing on every render
  const pageWallpapers = useMemo(() => {
    if (Array.isArray(itemsOverride) && itemsOverride.length > 0) {
      return itemsOverride;
    }
    const filtered = allWallpapers.filter(wallpaper => wallpaper.pageType === pageType);

    return filtered;
  }, [itemsOverride, pageType, allWallpapers]);
  
  const filteredWallpapers = selectedCategory === "All" 
    ? pageWallpapers 
    : pageWallpapers.filter(wallpaper => 
        wallpaper.category === selectedCategory || 
        wallpaper.color === selectedCategory
      );
  
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWallpapers.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={wallpaper.image}
                  alt={wallpaper.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = premiumWallpaper; }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                            <img
                              src={wallpaper.image}
                              alt={wallpaper.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.currentTarget.src = premiumWallpaper; }}
                              className="w-full h-full object-cover rounded-lg"
                            />
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
                      className="bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
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
