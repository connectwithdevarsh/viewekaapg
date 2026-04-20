import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Users, Home, Shield, Award } from "lucide-react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-[hsl(220,25%,8%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About <span className="text-gradient">EKAA PG</span>
          </h2>
          <p className="text-xl text-purple-200/60">Your home away from home</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Modern hostel accommodation"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>

          <div className={`space-y-6 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold text-white">
              Welcome to EKAA PG
            </h3>
            <p className="text-purple-200/70 leading-relaxed">
              At EKAA PG, we understand the importance of a safe, comfortable,
              and affordable living space for students and working professionals. Located
              in the prime area of Chanakyapuri, Ahmedabad, we have been providing quality
              accommodation for boys for several years.
            </p>
            <p className="text-purple-200/70 leading-relaxed">
              Our mission is to create a homely environment where residents can focus on
              their studies and career while enjoying all modern amenities. We prioritize
              cleanliness, security, and comfort to ensure our residents have the best
              possible experience.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card border-purple-500/20">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-gradient-gold">5+</div>
                  <div className="text-sm text-purple-200/60">Years Experience</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-purple-500/20">
                <CardContent className="text-center p-4">
                  <div className="text-2xl font-bold text-gradient-gold">50+</div>
                  <div className="text-sm text-purple-200/60">Happy Residents</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
