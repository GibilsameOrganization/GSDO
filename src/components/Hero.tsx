import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  order_index: number;
  active: boolean;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback slides in case database is empty
  const fallbackSlides = [
    {
      id: "fallback-1",
      image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
      title: "Empowering People. Building Sustainable Futures.",
      subtitle: "Together, we create lasting change in communities worldwide through sustainable development and humanitarian action.",
      order_index: 1,
      active: true
    },
    {
      id: "fallback-2",
      image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop",
      title: "Education Opens Doors to Opportunity",
      subtitle: "Breaking cycles of poverty through quality education and youth empowerment programs across the globe.",
      order_index: 2,
      active: true
    },
    {
      id: "fallback-3",
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop",
      title: "Clean Water Changes Everything",
      subtitle: "Providing access to clean water and sanitation facilities that transform entire communities.",
      order_index: 3,
      active: true
    }
  ];

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching hero slides:', error);
        setSlides(fallbackSlides);
      } else if (data && data.length > 0) {
        setSlides(data);
      } else {
        // No slides in database, use fallback
        setSlides(fallbackSlides);
      }
    } catch (error) {
      console.error('Unexpected error fetching slides:', error);
      setSlides(fallbackSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#who-we-are');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden flex items-center justify-center bg-gsdo-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen overflow-hidden flex items-center justify-center bg-gsdo-black">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to GSDO</h1>
          <p className="text-xl">Empowering Communities Through Sustainable Development</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load image:', slide.image_url);
              // Fallback to a placeholder or default image
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gsdo-black/30 via-gsdo-black/40 to-gsdo-black/60" />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center pt-16">
        <div className="text-center text-white max-w-5xl mx-auto px-4">
          <div className={`transform transition-all duration-800 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="inline-block animate-fade-in">
                {slides[currentSlide].title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
              <Button 
                size="lg" 
                className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Join Our Mission
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-gsdo-black px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white shadow-lg" 
                : "bg-white/40 hover:bg-white/60"
            }`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToNext}
          className="text-white hover:text-gray-300 transition-colors duration-300 flex flex-col items-center space-y-2 group"
        >
          <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <ChevronDown size={24} className="group-hover:transform group-hover:translate-y-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-75 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
