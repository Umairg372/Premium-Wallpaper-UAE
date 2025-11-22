import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getCurated3D } from "@/lib/localContent";

const ThreeDWallpapers = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                3D Wallpapers Collection
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience depth and dimension with our stunning 3D wallpaper designs
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Optical Depth</h3>
                <p className="text-muted-foreground">Create stunning visual depth in any room</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Modern Designs</h3>
                <p className="text-muted-foreground">Contemporary 3D patterns and effects</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">High-resolution 3D wallpapers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery 
              categories={['3D Geometric', '3D Nature', '3D Abstract', '3D Luxury']}
              title="Explore Our 3D Wallpapers"
              pageType="3d"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ThreeDWallpapers;

