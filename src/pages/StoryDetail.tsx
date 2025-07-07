import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Database["public"]["Tables"]["stories"]["Row"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setErrorMsg("Story not found.");
        setStory(null);
      } else {
        setStory(data);
      }
      setLoading(false);
    };
    if (id) fetchStory();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xl">Loading story...</div>;
  }
  if (errorMsg || !story) {
    return <div className="py-20 text-center text-red-600 text-xl">{errorMsg || "Story not found."}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="mb-6 text-royal-blue hover:underline">← Back</button>
      <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
      {story.image_url && (
        <img src={story.image_url} alt={story.title} className="w-full h-80 object-cover rounded mb-6" />
      )}
      <div className="flex items-center space-x-4 mb-4">
        <span className="bg-royal-blue text-white px-3 py-1 rounded-full text-sm font-medium">{story.location}</span>
        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">{story.impact}</span>
      </div>
      <div className="prose prose-lg max-w-none mb-8">
        {story.excerpt && (
          <div dangerouslySetInnerHTML={{ __html: story.excerpt }} />
        )}
      </div>
    </div>
  );
};

export default StoryDetail; 