import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Instagram, Youtube, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/pranav-sood-ab107b311',
    color: 'from-primary/20 to-primary/30',
    description: 'Connect professionally',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/cse.editz?igsh=MWo1eTJ2cTRwdTdrOA==',
    color: 'from-accent/20 to-accent/30',
    description: 'Visual stories',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@Tej_Vah',
    color: 'from-destructive/20 to-destructive/30',
    description: 'Video content',
  },
];

const SocialSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPhoneOn, setIsPhoneOn] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => setIsPhoneOn(true),
        onLeaveBack: () => setIsPhoneOn(false),
      });

      gsap.from('.phone-container', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="min-h-screen py-24 relative gradient-section-3"
    >
      {/* Studio Background */}
      <div className="absolute inset-0 studio-light opacity-30" />
      
      {/* Table Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-secondary/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm text-foreground/90 tracking-widest uppercase font-medium">Connect</span>
          <h2 className="text-4xl md:text-5xl font-light hero-text mt-2 text-foreground">Let's Stay in Touch</h2>
        </div>

        {/* Phone Container */}
        <div className="phone-container flex justify-center">
          <div 
            className={`relative transition-all duration-700 ${
              isPhoneOn ? 'scale-100' : 'scale-95 opacity-80'
            }`}
          >
            {/* Phone Frame */}
            <div className="w-64 md:w-72 rounded-[3rem] bg-gradient-to-b from-secondary to-muted p-3 shadow-2xl shadow-black/50">
              {/* Phone Screen */}
              <div className={`phone-screen rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                isPhoneOn ? 'opacity-100' : 'opacity-30'
              }`}>
                {/* Status Bar */}
                <div className="bg-gradient-to-b from-muted to-secondary/80 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">9:41</span>
                  <div className="w-20 h-6 rounded-full bg-background/50" />
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 rounded-sm bg-muted-foreground/50" />
                    <div className="w-6 h-3 rounded-sm border border-muted-foreground/50 flex items-center justify-end pr-0.5">
                      <div className="w-4 h-2 rounded-sm bg-primary/50" />
                    </div>
                  </div>
                </div>

                {/* Phone Content */}
                <div className="bg-gradient-to-b from-secondary/80 to-muted/50 p-6 min-h-[400px]">
                  <h3 className="text-center text-lg font-medium hero-text mb-6">Social Links</h3>
                  
                  {/* App Icons */}
                  <div className="space-y-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`social-icon flex items-center gap-4 p-4 w-full clickable group bg-gradient-to-r ${social.color}`}
                        style={{
                          opacity: isPhoneOn ? 1 : 0,
                          transform: isPhoneOn ? 'translateX(0)' : 'translateX(-20px)',
                          transition: `all 0.5s ease ${index * 150}ms`,
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-background/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <social.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium">{social.name}</p>
                          <p className="text-xs text-muted-foreground">{social.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    ))}
                  </div>

                  {/* Home Indicator */}
                  <div className="mt-8 flex justify-center">
                    <div className="w-32 h-1 rounded-full bg-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Glow */}
            {isPhoneOn && (
              <div className="absolute inset-0 -z-10 rounded-[3rem] bg-primary/20 blur-2xl animate-glow-pulse" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
