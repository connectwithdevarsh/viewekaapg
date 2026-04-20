import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Bed,
  Utensils,
  Wifi,
  Video,
  Brush,
  Droplets,
  ShirtIcon
} from "lucide-react";

const roomTypes = [
  {
    title: "1 Sharing Room (A/C)",
    description: "Private room with air conditioning",
    price: "₹25,000",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
  },
  {
    title: "2 Sharing Room (A/C)",
    description: "Shared room with air conditioning",
    price: "₹13,000",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"
  },
  {
    title: "5 Sharing Room (A/C)",
    description: "Dormitory style with A/C",
    price: "₹7,000",
    image: "https://i.ibb.co/qYrc6Ck2/Screenshot-20260414-221556.jpg"
  },
  {
    title: "6 Sharing Room (A/C)",
    description: "Budget-friendly shared room",
    price: "₹7,000",
    image: "https://i.ibb.co/qLt01Tqn/Screenshot-20260414-221843.jpg"
  }
];

const facilities = [
  { icon: Bed, label: "Bed & Locker" },
  { icon: Utensils, label: "Home-cooked Food" },
  { icon: Wifi, label: "High-speed Wi-Fi" },
  { icon: Video, label: "CCTV Security" },
  { icon: Brush, label: "Daily Cleaning" },
  { icon: Droplets, label: "Drinking Water" },
  { icon: ShirtIcon, label: "Washing Machine" }
];

export default function RoomsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('rooms');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="rooms" className="py-24 bg-[hsl(220,25%,6%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Rooms & <span className="text-gradient">Facilities</span>
          </h2>
          <p className="text-xl text-purple-200/60 max-w-3xl mx-auto">
            Choose from our comfortable, fully-equipped room options designed for your convenience and comfort
          </p>
        </div>

        {/* Room Options */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          {roomTypes.map((room, index) => (
            <Card key={index} className="glass-card border-purple-500/20 overflow-hidden group card-hover">
              <div className="aspect-video overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">
                  {room.title}
                </h3>
                <p className="text-purple-200/60 text-sm mb-4">{room.description}</p>
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gradient-gold">{room.price}</span>
                    <span className="text-sm text-purple-300/50 ml-1">/month</span>
                  </div>
                  <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    All Inclusive
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Facilities */}
        <Card className={`glass-card border-purple-500/20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <CardContent className="p-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Premium <span className="text-gradient">Facilities</span>
              </h3>
              <p className="text-lg text-purple-200/60">
                Everything you need for a comfortable stay
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
              {facilities.map((facility, index) => (
                <div key={index} className="text-center group">
                  <div className="facility-icon w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <facility.icon className="text-purple-400" size={28} />
                  </div>
                  <p className="text-sm font-medium text-purple-200/80 group-hover:text-white transition-colors">
                    {facility.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
