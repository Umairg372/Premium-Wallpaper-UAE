import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CONTACT_INFO, NAVIGATION_LINKS } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Premium Wallpaper UAE</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for premium wallpaper solutions in the UAE. 
              Transforming spaces with quality and style.
            </p>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">A</span>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-sm font-bold">A</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">{CONTACT_INFO.phone1}</p>
                  <p className="text-sm text-muted-foreground">{CONTACT_INFO.phone2}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <p className="text-sm text-muted-foreground">{CONTACT_INFO.email}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <p className="text-sm text-muted-foreground">All Emirates, UAE</p>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Business Hours</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-1" />
                <div className="text-sm text-muted-foreground">
                  <p>{CONTACT_INFO.businessHours.weekdays}</p>
                  <p>{CONTACT_INFO.businessHours.friday}</p>
                  <p>{CONTACT_INFO.businessHours.saturday}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Premium Wallpaper UAE. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
