import { Button } from "@/components/ui/button";
import { Star, Award } from "lucide-react";
import heroImage from "@/assets/hero-wallpaper.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury interior with elegant wallpaper" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--hero-overlay))]/80 via-[hsl(var(--hero-overlay))]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Home in One Visit!
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-xl">
              A seamless process, stunning results: Let us elevate your interior.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Button variant="hero" size="xl">
                Schedule a Free Home Visit →
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-lg px-3 py-1 flex items-center gap-1">
                  <span className="text-foreground font-bold">4.9</span>
                  <Star className="h-4 w-4 fill-[hsl(var(--trust-badge))] text-[hsl(var(--trust-badge))]" />
                </div>
                <span className="text-sm text-white/90">+5,000 happy clients</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-sm text-white/90">Trusted Premium Wallpaper Provider in UAE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
