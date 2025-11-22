import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getCuratedColors } from "@/lib/localContent";
import BeforeAfter from "@/components/BeforeAfter";

const Colors = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-100 to-green-100 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Colors & Themes
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find the perfect color palette for your space with our curated collections
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Color Collections</h2>
              <p className="text-muted-foreground">Browse by your favorite colors</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown', 'Gray', 'Black', 'White', 'Gold'].map((color) => (
                <div key={color} className="aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
                  <span className="font-medium text-sm">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery 
              categories={['Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple', 'Gray', 'White', 'Brown', 'Gold']}
              title="Color-Based Collections"
              pageType="colors"
              itemsOverride={getCuratedColors()}
            />
          </div>
        </section>

        {/* Before/After Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Transformations</h2>
              <p className="text-muted-foreground">See how colors can transform your space</p>
            </div>
            <BeforeAfter />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Colors;
