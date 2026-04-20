import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Star, Zap, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const roomRatesChanakyapuri = [
  { type: "1 Sharing Room (A/C)", price: "₹25,000/month" },
  { type: "2 Sharing Room (A/C)", price: "₹13,000/month" },
  { type: "5 Sharing Room (A/C)", price: "₹7,500/month" },
  { type: "6 Sharing Room (A/C)", price: "₹7,500/month" }
];

const roomRatesKhakhrej = [
  { type: "1 Sharing Room (A/C)", price: "₹25,000/month" },
  { type: "2 Sharing Room (A/C)", price: "₹13,000/month" },
  { type: "5 Sharing Room (A/C)", price: "₹7,500/month" },
  { type: "6 Sharing Room (A/C)", price: "₹7,500/month" }
];

export default function PricingSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('pricing');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-24 bg-[hsl(220,25%,6%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-purple-200/60 max-w-3xl mx-auto">
            Choose the best location and room for you
          </p>
        </div>

        <div className={`max-w-6xl mx-auto ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          <div className="grid lg:grid-cols-2 gap-8 mb-12">

            {/* Chanakyapuri Pricing Card */}
            <Card className="glass-card border-purple-500/30 overflow-hidden">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">EKAA PG (Chanakyapuri)</h3>
                  <p className="text-purple-200/60">Starting from ₹7,500/month</p>
                </div>
                <div className="space-y-4">
                  {roomRatesChanakyapuri.map((rate, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-4 px-6 glass-card-light rounded-xl"
                    >
                      <span className="font-medium text-white">{rate.type}</span>
                      <span className="text-xl font-bold text-gradient-gold">{rate.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Khakhrej Pricing Card */}
            <Card className="glass-card border-indigo-500/30 overflow-hidden">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">EKAA PG (Khakhrej)</h3>
                  <p className="text-indigo-200/60">Starting from ₹7,500/month</p>
                </div>
                <div className="space-y-4">
                  {roomRatesKhakhrej.map((rate, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-4 px-6 glass-card-light rounded-xl bg-indigo-900/10"
                    >
                      <span className="font-medium text-white">{rate.type}</span>
                      <span className="text-xl font-bold text-blue-400">{rate.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Card (Spans 2 columns) */}
            <Card className="glass-card border-purple-500/30 lg:col-span-2">
              <CardContent className="p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">What's Included in Both</h3>
                  <p className="text-purple-200/60">All facilities at no extra cost</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-4 p-4 glass-card-light rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white">All Utilities</div>
                      <div className="text-purple-200/60 text-sm">Electricity, Water, Wi-Fi, Cleaning</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 glass-card-light rounded-xl">
                    <Shield className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Security Deposit</div>
                      <div className="text-purple-200/60 text-sm">₹4,000 (100% Refundable on leaving)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 glass-card-light rounded-xl">
                    <Star className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Premium Services</div>
                      <div className="text-purple-200/60 text-sm">24/7 Support, Maintenance, Security</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="glass-card border-purple-500/30">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Book Your Room?</h3>
                <p className="text-purple-200/60 mb-6">Contact us now to secure your comfortable stay in Ahmedabad</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/919559755055"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    WhatsApp Now
                  </a>
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-gen-outline inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white"
                  >
                    Book Online
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
