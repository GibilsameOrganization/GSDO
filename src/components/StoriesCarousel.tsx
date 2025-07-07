import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

const StoriesCarousel = () => {
  const [stories, setStories] = useState<Database["public"]["Tables"]["stories"]["Row"][]>([]);
  const [currentStory, setCurrentStory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("active", true)
        .order("order_index");
      if (error) {
        setErrorMsg("Error fetching stories: " + error.message);
        setStories([]);
      } else if (!data || data.length === 0) {
        setErrorMsg("No active stories found. Please check the admin panel and database.");
        setStories([]);
      } else {
        setStories(data);
      }
      setLoading(false);
    };
    fetchStories();
  }, []);

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">Stories from the Field</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Loading stories...</p>
        </div>
      </section>
    );
  }
  if (errorMsg) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">Stories from the Field</h2>
          <p className="text-xl text-red-600 max-w-3xl mx-auto mb-8">{errorMsg}</p>
        </div>
      </section>
    );
  }
  if (stories.length === 0) {
    return null;
  }

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
                src={stories[currentStory].image_url || "https://via.placeholder.com/800x400?text=No+Image"}
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
                  <div className="prose prose-lg text-lg text-gray-200 mb-6">
                    {stories[currentStory].excerpt && (
                      <div dangerouslySetInnerHTML={{ __html: stories[currentStory].excerpt }} />
                    )}
                  </div>
                  <button
                    className="bg-royal-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    onClick={() => navigate(`/stories/${stories[currentStory].id}`)}
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {stories.length > 1 && (
            <>
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
            </>
          )}

          {/* Story Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
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
