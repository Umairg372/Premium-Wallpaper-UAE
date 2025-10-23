import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl md:text-2xl font-bold text-foreground">
              Adeeb Altaf Wallpaper UAE
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-accent transition-colors">Home</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Collections</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Colors</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">Kids</a>
            <a href="#" className="text-foreground hover:text-accent transition-colors">More</a>
          </div>

          <div className="hidden md:block">
            <Button variant="hero" size="default">
              Book a free visit
            </Button>
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
