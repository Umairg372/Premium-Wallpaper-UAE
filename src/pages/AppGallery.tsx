import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getLocalAppGallery, getCuratedAppGallery } from "@/lib/localContent";

const AppGallery = () => {
  const localItems = getLocalAppGallery();
  const curated = getCuratedAppGallery();
  const items = localItems.length > 0 ? localItems : curated;

  // Derive simple filter chips from categories and colors present
  const categorySet = new Set<string>();
  const colorSet = new Set<string>();
  for (const it of items) {
    if (it.category) categorySet.add(it.category);
    if (it.color) colorSet.add(it.color);
  }
  const categories = ["All", ...Array.from(categorySet.values()), ...Array.from(colorSet.values())];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGallery
              title="App Gallery"
              categories={categories}
              pageType="collections"
              itemsOverride={items}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppGallery;


