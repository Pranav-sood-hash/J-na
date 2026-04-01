import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Code, User, Briefcase, MessageSquare, Mail } from 'lucide-react';
const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navItems = [{
    name: 'About',
    href: '#about',
    icon: User
  }, {
    name: 'Skills',
    href: '#skills',
    icon: Code
  }, {
    name: 'Projects',
    href: '#projects',
    icon: Briefcase
  }, {
    name: 'Quote',
    href: '#quote',
    icon: MessageSquare
  }, {
    name: 'Contact',
    href: '#contact',
    icon: Mail
  }];
  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button className="text-xl font-semibold hero-text clickable" onClick={() => navigate('/admin')}>
            Portfolio
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => <button key={item.name} onClick={() => handleNavClick(item.href)} className="text-sm transition-colors duration-300 clickable flex items-center gap-2 text-foreground hover:text-foreground/80">
                <item.icon size={16} className="text-foreground/70" />
                {item.name}
              </button>)}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground clickable" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Laptop Opening Animation */}
      <div className={`fixed inset-0 z-30 md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" onClick={() => setIsOpen(false)} />

        {/* Menu Content - Laptop Screen Style */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 transition-all duration-700 ${isOpen ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'}`} style={{
        transformOrigin: 'bottom center',
        perspective: '1000px'
      }}>
          {/* Laptop Frame */}
          <div className="laptop-screen rounded-xl p-6 relative overflow-hidden">
            {/* Screen Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            
            {/* Menu Items */}
            <div className="relative space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold hero-text">Navigation</h3>
                <div className="w-16 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>

              {navItems.map((item, index) => <button key={item.name} onClick={() => handleNavClick(item.href)} className="w-full flex items-center gap-4 p-3 rounded-lg glass-subtle hover:bg-primary/10 transition-all duration-300 clickable" style={{
              transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateX(0)' : 'translateX(-20px)'
            }}>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <span className="text-foreground">{item.name}</span>
                </button>)}
            </div>
          </div>

          {/* Laptop Base */}
          <div className="w-full h-3 bg-secondary rounded-b-xl" />
          <div className="w-20 h-2 mx-auto bg-secondary/80 rounded-b-lg" />
        </div>
      </div>
    </>;
};
export default Navbar;
