import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getCuratedStickers } from "@/lib/localContent";

const Stickers = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-100 via-yellow-100 to-orange-100 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Room Decoration Stickers
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your walls with our easy-to-apply decorative stickers for every room
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy to Apply</h3>
                <p className="text-muted-foreground">Simple peel and stick installation</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Removable</h3>
                <p className="text-muted-foreground">No damage to walls when removed</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Variety of Designs</h3>
                <p className="text-muted-foreground">Kids, quotes, decorative, and more</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">High Quality</h3>
                <p className="text-muted-foreground">Durable and long-lasting materials</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery 
              categories={['Kids Stickers', 'Decorative Stickers', 'Quote Stickers', 'Shape Stickers']}
              title="Browse Our Sticker Collection"
              pageType="stickers"
            />
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Perfect For Every Room</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Kids Rooms</h3>
                <p className="text-muted-foreground">Fun characters and educational designs</p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Living Room</h3>
                <p className="text-muted-foreground">Elegant decorative patterns</p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Bedroom</h3>
                <p className="text-muted-foreground">Calming quotes and designs</p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Office</h3>
                <p className="text-muted-foreground">Motivational and professional</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Stickers;

