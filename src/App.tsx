import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import ThreeDWallpapers from "./pages/ThreeDWallpapers";
import Kids from "./pages/Kids";
import Colors from "./pages/Colors";
import Stickers from "./pages/Stickers";
import About from "./pages/About";
import AppGallery from "./pages/AppGallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/3d-wallpapers" element={<ThreeDWallpapers />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/stickers" element={<Stickers />} />
          <Route path="/about" element={<About />} />
          <Route path="/app-gallery" element={<AppGallery />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
