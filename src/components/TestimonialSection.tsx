import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Ahmed",
    location: "Dubai Marina",
    rating: 5,
    text: "Absolutely amazing service! The team was professional, punctual, and the wallpaper quality is outstanding. My living room looks like a magazine cover now.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Mohammed Al-Rashid",
    location: "Abu Dhabi",
    rating: 5,
    text: "Excellent work from start to finish. They helped me choose the perfect design and the installation was flawless. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Fatima Hassan",
    location: "Sharjah",
    rating: 5,
    text: "The kids' room wallpaper is perfect! My children love their new space. The team was very patient with all our questions and delivered exactly what we wanted.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Ahmed Khalil",
    location: "Ajman",
    rating: 5,
    text: "Professional service with attention to detail. The luxury wallpaper in my office has impressed all my clients. Worth every dirham!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Aisha Mohammed",
    location: "Ras Al Khaimah",
    rating: 5,
    text: "From consultation to completion, everything was perfect. The team understood my vision and brought it to life beautifully.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Quote className="h-12 w-12 text-primary mx-auto mb-4" />
            <blockquote className="text-lg md:text-xl text-muted-foreground italic mb-6">
              "{currentTestimonial.text}"
            </blockquote>
            
            <div className="flex justify-center mb-4">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-foreground">{currentTestimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{currentTestimonial.location}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialSection;
