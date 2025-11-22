import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getCuratedCollections } from "@/lib/localContent";

const Collections = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Collections
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our premium wallpaper collections designed to transform your space
              </p>
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery 
              categories={['Modern', 'Classic', 'Luxury', 'Custom']}
              title="Premium Wallpaper Collections"
              pageType="collections"
              
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
