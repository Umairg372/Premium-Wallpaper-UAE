import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialSection from "@/components/TestimonialSection";
import { Award, Users, Star, Shield } from "lucide-react";
import premiumWallpaper from "@/assets/premium-wallpaper.jpg";
import step1 from "@/assets/step1-design.jpg";
import step2 from "@/assets/step2-visit.jpg";
import step3 from "@/assets/step3-design.jpg";
import step4 from "@/assets/step4-install.jpg";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                About Premium Wallpaper UAE
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your trusted partner in transforming spaces with premium wallpapers
              </p>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  With over 10 years of experience in the UAE, Premium Wallpaper has been 
                  transforming homes and businesses with premium wallpaper solutions. We specialize 
                  in providing high-quality wallpapers with professional installation services.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our team of expert designers and installers ensures every project meets the 
                  highest standards of quality and customer satisfaction. From modern minimalist 
                  designs to luxurious textures, we have the perfect wallpaper for every space.
                </p>
                <p className="text-muted-foreground">
                  We pride ourselves on our attention to detail, competitive pricing, and 
                  commitment to delivering exceptional results that exceed our clients' expectations.
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Premium Quality</h4>
                      <p className="text-sm text-muted-foreground">Only the finest materials and designs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Expert Team</h4>
                      <p className="text-sm text-muted-foreground">Professional designers and installers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Guaranteed Satisfaction</h4>
                      <p className="text-sm text-muted-foreground">100% satisfaction guarantee on all work</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.9</div>
                <div className="text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  Customer Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Work Gallery</h2>
              <p className="text-muted-foreground">A quick peek at our premium finishes and on-site process</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <img src={premiumWallpaper} alt="Premium wallpaper" className="w-full h-64 object-cover rounded-lg" />
              <img src={step1} alt="Design step" className="w-full h-64 object-cover rounded-lg" />
              <img src={step2} alt="Site visit" className="w-full h-64 object-cover rounded-lg" />
              <img src={step3} alt="Production" className="w-full h-64 object-cover rounded-lg" />
              <img src={step4} alt="Installation" className="w-full h-64 object-cover rounded-lg" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground">Don't just take our word for it</p>
            </div>
            <TestimonialSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
