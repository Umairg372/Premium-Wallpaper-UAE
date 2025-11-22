import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getCuratedKids } from "@/lib/localContent";

const Kids = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-100 to-blue-100 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Kids Wallpaper Collection
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create magical spaces for your little ones with our playful and colorful designs
              </p>
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery 
              categories={['Nursery', 'Toddlers', 'Teens', 'Educational']}
              title="Kids Wallpaper Designs"
              isKidsTheme={true}
              pageType="kids"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Kids;
