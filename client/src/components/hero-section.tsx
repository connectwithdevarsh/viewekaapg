import { Button } from "@/components/ui/button";
import { MessageCircle, Home, Shield, Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToRooms = () => {
    const element = document.querySelector("#rooms");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative hero-gradient text-white min-h-screen flex items-center">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container-max section-padding w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium tracking-wide">Welcome to EKAA PG</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Perfect
                <span className="block text-gradient">
                  Home Away
                </span>
                from Home
              </h1>
              <p className="text-xl md:text-2xl text-purple-200/80 leading-relaxed">
                Safe, comfortable, and budget-friendly accommodation for students
                in the heart of Ahmedabad near RC Technical Institute.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center glass-card-light rounded-xl p-4">
                <div className="text-3xl font-bold text-gradient-gold">5+</div>
                <div className="text-sm text-purple-200/70">Years Experience</div>
              </div>
              <div className="text-center glass-card-light rounded-xl p-4">
                <div className="text-3xl font-bold text-gradient-gold">50+</div>
                <div className="text-sm text-purple-200/70">Happy Residents</div>
              </div>
              <div className="text-center glass-card-light rounded-xl p-4">
                <div className="text-3xl font-bold text-gradient-gold">24/7</div>
                <div className="text-sm text-purple-200/70">Security</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToRooms}
                size="lg"
                className="btn-gen text-white px-8 py-6 text-lg rounded-xl"
              >
                <Home className="mr-2 w-5 h-5" />
                Explore Rooms
              </Button>
              <Button
                onClick={scrollToContact}
                size="lg"
                className="btn-gen-outline text-white px-8 py-6 text-lg rounded-xl hover:text-white"
              >
                <Shield className="mr-2 w-5 h-5" />
                Book Now
              </Button>
            </div>

            {/* WhatsApp CTA */}
            <div className="glass-card-light rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-200/70">Need instant help?</p>
                <p className="font-semibold text-white">Chat with us on WhatsApp</p>
              </div>
              <Button
                asChild
                className="btn-whatsapp text-white rounded-full px-6"
              >
                <a href="https://wa.me/918002880087" target="_blank" rel="noopener noreferrer">
                  Chat Now
                </a>
              </Button>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className={`space-y-6 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">24/7 Security</h3>
                <p className="text-sm text-purple-200/60">CCTV monitoring and secure access</p>
              </div>
              <div className="glass-card p-6 rounded-2xl card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Premium Facilities</h3>
                <p className="text-sm text-purple-200/60">AC rooms, Wi-Fi, home-cooked food</p>
              </div>
              <div className="glass-card p-6 rounded-2xl card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Prime Location</h3>
                <p className="text-sm text-purple-200/60">Near colleges and institutes</p>
              </div>
              <div className="glass-card p-6 rounded-2xl card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Quick Support</h3>
                <p className="text-sm text-purple-200/60">Instant response on WhatsApp</p>
              </div>
            </div>

            {/* Pricing Preview */}
            <div className="glass-card p-8 rounded-2xl text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-200">Starting From</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-gradient-gold">₹7,500</div>
                <div className="text-purple-200/70 mt-2">per month</div>
                <div className="text-sm text-purple-300/50 mt-2">All inclusive pricing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
