
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoriesCarousel = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      image: "https://images.unsplash.com/photo-1594736797933-d0eaaa2d3f3b?q=80&w=2072&auto=format&fit=crop",
      title: "Amara's Journey to Clean Water",
      excerpt: "How a simple well transformed an entire village in Mali, giving 500 families access to clean water for the first time.",
      location: "Mali, West Africa",
      impact: "500 families served"
    },
    {
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2069&auto=format&fit=crop",
      title: "Breaking Barriers Through Education",
      excerpt: "Meet Fatima, who became the first in her family to graduate university thanks to our scholarship program.",
      location: "Bangladesh",
      impact: "200+ scholarships awarded"
    },
    {
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
      title: "Solar Power Lights Up Hope",
      excerpt: "Renewable energy project brings electricity to remote communities, powering schools and health clinics.",
      location: "Kenya",
      impact: "15 communities connected"
    },
    {
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
      title: "Women's Cooperative Creates Change",
      excerpt: "Supporting women entrepreneurs in starting sustainable businesses that lift entire communities.",
      location: "Guatemala",
      impact: "300 women empowered"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Stories from the Field
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories of transformation from the communities we serve
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-xl">
            <div className="relative">
              <img
                src={stories[currentStory].image}
                alt={stories[currentStory].title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gsdo-black via-transparent to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-royal-blue px-3 py-1 rounded-full text-sm font-medium">
                      {stories[currentStory].location}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {stories[currentStory].impact}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {stories[currentStory].title}
                  </h3>
                  <p className="text-lg text-gray-200 mb-6">
                    {stories[currentStory].excerpt}
                  </p>
                  <button className="bg-royal-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft size={24} className="text-gsdo-black" />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight size={24} className="text-gsdo-black" />
          </button>

          {/* Story Indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStory ? "bg-royal-blue" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoriesCarousel;
