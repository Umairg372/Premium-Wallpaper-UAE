import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const beforeAfterData = [
  {
    id: 1,
    title: "Living Room Transformation",
    before: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
    description: "From plain white walls to elegant geometric patterns"
  },
  {
    id: 2,
    title: "Kids Room Makeover",
    before: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?w=800&h=600&fit=crop",
    description: "Creating a magical space for children with themed wallpapers"
  },
  {
    id: 3,
    title: "Office Space Upgrade",
    before: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&h=600&fit=crop",
    description: "Professional luxury wallpaper for a sophisticated workspace"
  },
  {
    id: 4,
    title: "Bedroom Elegance",
    before: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&h=600&fit=crop",
    description: "From basic walls to premium textured designs"
  }
];

const BeforeAfter = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % beforeAfterData.length);
    setShowAfter(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + beforeAfterData.length) % beforeAfterData.length);
    setShowAfter(false);
  };

  const currentItem = beforeAfterData[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{currentItem.title}</CardTitle>
          <p className="text-center text-muted-foreground">{currentItem.description}</p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={showAfter ? currentItem.after : currentItem.before}
                alt={showAfter ? "After" : "Before"}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              
              {/* Overlay with slider */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAfter(!showAfter)}
                    className="rounded-full"
                  >
                    {showAfter ? "Show Before" : "Show After"}
                  </Button>
                </div>
              </div>

              {/* Before/After Labels */}
              <div className="absolute top-4 left-4">
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {showAfter ? "After" : "Before"}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={prevSlide}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {beforeAfterData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowAfter(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextSlide}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeforeAfter;
