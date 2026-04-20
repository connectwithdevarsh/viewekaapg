import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Home, Sparkles } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#rooms", label: "Rooms" },
    { href: "#pricing", label: "Pricing" },
    { href: "#location", label: "Location" },
    { href: "#gallery", label: "Gallery" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[hsl(220,25%,8%)]/95 backdrop-blur-xl shadow-2xl shadow-purple-900/10 border-b border-purple-500/10'
        : 'bg-transparent'
    }`}>
      <div className="container-max">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EKAA PG</h1>
              <p className="text-xs text-purple-200 font-medium">Your Home in Ahmedabad</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-purple-200/80 hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-purple-500/10 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 group-hover:w-1/2"></span>
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-purple-500/20 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ${
        mobileMenuOpen
          ? 'max-h-96 opacity-100'
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-[hsl(220,25%,8%)]/98 backdrop-blur-xl border-t border-purple-500/20 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className="block py-3 text-purple-200/80 hover:text-white w-full text-left font-medium hover:bg-purple-500/10 rounded-xl px-4 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
