import { useState, useEffect } from "react";
import { CONTACT_INFO, WHATSAPP_MESSAGE } from "@/lib/constants";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="group relative rounded-full h-16 w-16 bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center animate-pulse hover:animate-none"
        aria-label="Contact us on WhatsApp"
      >
        {/* Official WhatsApp Logo - Cleaner Design */}
        <svg
          viewBox="0 0 175.216 175.552"
          className="h-10 w-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="whatsapp-gradient"
              x1="85.915"
              x2="86.535"
              y1="32.567"
              y2="137.092"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#f0f0f0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#whatsapp-gradient)"
            d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
          />
          <path
            fill="#25D366"
            d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929zm0 110.093c-9.59 0-18.988-2.812-27.075-8.107l-1.943-1.151-20.121 5.279 5.37-19.623-1.264-2.011c-5.839-9.286-8.928-20.031-8.928-31.071.013-32.217 26.23-58.427 58.467-58.427 15.62.005 30.295 6.086 41.34 17.131a57.96 57.96 0 0 1 17.062 41.279c-.013 32.218-26.23 58.428-58.466 58.428z"
          />
          <path
            fill="#25D366"
            fillRule="evenodd"
            d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
            clipRule="evenodd"
          />
        </svg>
        
        {/* Pulse ring effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default WhatsAppButton;
