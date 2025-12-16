import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get in touch with us for a free consultation and quote
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form - Dark Theme */}
        <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Phone Numbers</h3>
                      <p className="text-gray-300">034505474430</p>
                      <p className="text-gray-300">00971501973357</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <p className="text-gray-300">mainaltaf123@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Service Areas</h3>
                      <p className="text-gray-300">All Emirates, UAE</p>
                      <p className="text-gray-300">Free home visits available</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="h-6 w-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                      <p className="text-gray-300">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-300">Friday: 2:00 PM - 6:00 PM</p>
                      <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <h3 className="font-semibold text-white mb-4">Why Choose Our Service?</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Free home consultation and measurement</li>
                    <li>• Professional installation by experts</li>
                    <li>• Premium quality wallpapers</li>
                    <li>• Competitive pricing</li>
                    <li>• 100% satisfaction guarantee</li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Dark Theme */}
        <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Book your free consultation today and let our experts help you choose the perfect wallpaper for your home or office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:034505474430">
                <button className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-lg">
                  Call Now: 034505474430
                </button>
              </a>
              <a href="tel:00971501973357">
                <button className="px-8 py-4 bg-green-400 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors shadow-lg">
                  Call Now: 00971501973357
                </button>
              </a>
              <a href={`https://wa.me/00971501973357`}>
                <button className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-semibold transition-colors shadow-lg">
                  WhatsApp Us
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
