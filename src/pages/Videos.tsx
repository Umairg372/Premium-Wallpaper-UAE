import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";

const Videos = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Video Wallpaper Collection
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our dynamic video wallpapers that bring your space to life
              </p>
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery
              categories={[]}
              title="Video Wallpapers"
              pageType="videos"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Videos;

