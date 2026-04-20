import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User, Phone, MapPin, MessageSquare, Send, Mail } from "lucide-react";

export default function ContactSection() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    college: "",
    roomType: "",
    stayDuration: "",
    phone: "",
    pgLocation: ""
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('contact');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const submitInquiry = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest("POST", "/api/inquiries", data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for your inquiry! We will contact you soon.",
      });
      setFormData({
        studentName: "",
        college: "",
        roomType: "",
        stayDuration: "",
        phone: "",
        pgLocation: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.college || !formData.roomType || !formData.phone || !formData.pgLocation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitInquiry.mutate(formData);
  };

  return (
    <section id="contact" className="py-24 bg-[hsl(220,25%,8%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-purple-200/60 max-w-3xl mx-auto">
            Ready to book your room? Contact us today and secure your comfortable stay in Ahmedabad!
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-12 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="glass-card border-purple-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mr-4">
                      <User className="text-purple-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">HarshvardhanSigh Rathod</p>
                      <p className="text-purple-200/60">Owner</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mr-4">
                      <Phone className="text-green-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">+91-9559755055</p>
                      <p className="text-purple-200/60">Call or WhatsApp</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <MapPin className="text-pink-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Address</p>
                      <p className="text-purple-200/60">
                        EKAA PG, Vishwas City 1, Chanakyapuri
                        <br />
                        EKAA PG, Khakhrej
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button asChild className="w-full btn-whatsapp text-white py-6 rounded-xl">
              <a href="https://wa.me/919559755055" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2" size={20} />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="glass-card border-purple-500/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Inquiry Form
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName" className="text-purple-200">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pgLocation" className="text-purple-200">Select Hostel *</Label>
                  <Select
                    value={formData.pgLocation}
                    onValueChange={(value) => setFormData({ ...formData, pgLocation: value })}
                  >
                    <SelectTrigger className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(220,25%,12%)] border-purple-500/20">
                      <SelectItem value="chanakyapuri" className="text-white hover:bg-purple-500/20">EKAA PG (Chanakyapuri)</SelectItem>
                      <SelectItem value="khakhrej" className="text-white hover:bg-purple-500/20">EKAA PG (Khakhrej)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college" className="text-purple-200">College/Company *</Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType" className="text-purple-200">Preferred Room Type *</Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) => setFormData({ ...formData, roomType: value })}
                  >
                    <SelectTrigger className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white">
                      <SelectValue placeholder="Select Room Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[hsl(220,25%,12%)] border-purple-500/20">
                      <SelectItem value="1-sharing" className="text-white hover:bg-purple-500/20">1 Sharing Room (A/C)</SelectItem>
                      <SelectItem value="2-sharing" className="text-white hover:bg-purple-500/20">2 Sharing Room (A/C)</SelectItem>
                      <SelectItem value="5-sharing" className="text-white hover:bg-purple-500/20">5 Sharing Room (A/C)</SelectItem>
                      <SelectItem value="6-sharing" className="text-white hover:bg-purple-500/20">6 Sharing Room (A/C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-purple-200">Stay Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 6 months, 1 year"
                    value={formData.stayDuration}
                    onChange={(e) => setFormData({ ...formData, stayDuration: e.target.value })}
                    className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-purple-200">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-[hsl(220,25%,12%)] border-purple-500/20 text-white placeholder:text-purple-300/30 focus:border-purple-500/50"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-gen text-white py-6 rounded-xl"
                  disabled={submitInquiry.isPending}
                >
                  <Send className="mr-2" size={18} />
                  {submitInquiry.isPending ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
