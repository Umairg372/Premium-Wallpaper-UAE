import step1Image from "@/assets/step1-design.jpg";
import step2Image from "@/assets/step2-visit.jpg";
import step3Image from "@/assets/step3-design.jpg";
import step4Image from "@/assets/step4-install.jpg";

const steps = [
  {
    number: "1",
    title: "Browse our designs and select your favorite",
    description: "Or we can also customize for you.",
    image: step1Image,
  },
  {
    number: "2",
    title: "Book a free visit directly in few seconds",
    description: "Our specialist will come to take measurements & help you choose your design.",
    image: step2Image,
  },
  {
    number: "3",
    title: "We customize your design",
    description: "Choose from thousands of designs or customize your own.",
    image: step3Image,
  },
  {
    number: "4",
    title: "Professional installation",
    description: "Our expert team installs your wallpaper perfectly.",
    image: step4Image,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            How it works ?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            4 simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
