import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface GallerySectionProps {
  onImageClick: (imageUrl: string) => void;
}

const galleryImages = [
  {
    url: "https://i.ibb.co/qLt01Tqn/Screenshot-20260414-221843.jpg",
    alt: "Student room interior"
  },
  {
    url: "https://i.ibb.co/qYrc6Ck2/Screenshot-20260414-221556.jpg",
    alt: "Common area"
  },
  {
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Kitchen facilities"
  },
  {
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Bathroom facilities"
  },
  {
    url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Building exterior"
  },
  {
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Shared dormitory"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Study area"
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Dining area"
  }
];

export default function GallerySection({ onImageClick }: GallerySectionProps) {
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

    const section = document.getElementById('gallery');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-[hsl(220,25%,8%)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Photo <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-xl text-purple-200/60 max-w-3xl mx-auto">
            Take a virtual tour of our modern facilities and comfortable living spaces
          </p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group aspect-square overflow-hidden rounded-2xl glass-card border-purple-500/20 cursor-pointer card-hover relative"
              onClick={() => onImageClick(image.url)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Eye className="text-white w-5 h-5" />
                </div>
                <p className="text-white font-medium text-center text-sm">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
