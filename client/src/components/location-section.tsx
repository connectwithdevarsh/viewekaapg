import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, GraduationCap, ExternalLink, Navigation, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function LocationSection() {
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

    const section = document.getElementById('location');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="location" className="py-24 bg-[hsl(220,25%,6%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-gradient">Locations</span>
          </h2>
          <p className="text-xl text-purple-200/60 max-w-3xl mx-auto">
            Strategically located across Ahmedabad for your convenience
          </p>
        </div>

        <div className={`space-y-24 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Chanakyapuri Location */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4">EKAA PG (Chanakyapuri)</h3>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <Card className="glass-card border-purple-500/20 card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl mr-4 flex items-center justify-center">
                        <MapPin className="text-purple-400 w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Our Address</h4>
                    </div>
                    <p className="text-lg text-purple-200/70 leading-relaxed">
                      EKAA PG, Near Silver Oak and RC Technical Institute<br />
                      Vishwas City 1, Chanakyapuri<br />
                      Ahmedabad – 380061, Gujarat
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-purple-500/20 card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl mr-4 flex items-center justify-center">
                        <GraduationCap className="text-green-400 w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Nearby Institutes</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 glass-card-light rounded-xl">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-green-400 mr-3" />
                          <span className="font-semibold text-white">RC Technical Institute</span>
                        </div>
                        <span className="text-green-400 font-bold">800m</span>
                      </div>
                      <div className="flex items-center justify-between p-4 glass-card-light rounded-xl">
                        <div className="flex items-center">
                          <Navigation className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="font-semibold text-white">Silver Oak University</span>
                        </div>
                        <span className="text-blue-400 font-bold">Nearby</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button asChild className="w-full btn-gen text-white py-6 rounded-xl">
                  <a
                    href="https://maps.app.goo.gl/z1KPt35Fzs9VYszA7"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2" size={18} />
                    Open in Google Maps
                  </a>
                </Button>
              </div>

              <Card className="glass-card border-purple-500/20 overflow-hidden card-hover">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.7272!2d72.5216!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjAiTiA3MsKwMzEnMTcuOCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[500px]"
                />
              </Card>
            </div>
          </div>

          {/* Khatraj Location */}
          <div>
            <h3 className="text-3xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">EKAA PG (Khatraj)</h3>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <Card className="glass-card border-indigo-500/20 card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl mr-4 flex items-center justify-center">
                        <MapPin className="text-indigo-400 w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Our Address</h4>
                    </div>
                    <p className="text-lg text-purple-200/70 leading-relaxed">
                      EKAA PG, Khatraj<br />
                      Ahmedabad, Gujarat
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-indigo-500/20 card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl mr-4 flex items-center justify-center">
                        <GraduationCap className="text-teal-400 w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Nearby Locations</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 glass-card-light rounded-xl">
                        <div className="flex items-center">
                          <Navigation className="w-5 h-5 text-teal-400 mr-3" />
                          <span className="font-semibold text-white">Local Campus</span>
                        </div>
                        <span className="text-teal-400 font-bold">Nearby</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-indigo-500/20 overflow-hidden card-hover flex items-center justify-center bg-gray-900 min-h-[500px]">
                  {/* Placeholder for Khatraj map iframe */}
                  <p className="text-purple-200/50">Map not configured yet</p>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
