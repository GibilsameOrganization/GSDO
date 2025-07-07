import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Database["public"]["Tables"]["news_articles"]["Row"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setErrorMsg("Article not found.");
        setArticle(null);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-xl">Loading article...</div>;
  }
  if (errorMsg || !article) {
    return <div className="py-20 text-center text-red-600 text-xl">{errorMsg || "Article not found."}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={() => navigate(-1)} className="mb-6 text-royal-blue hover:underline">← Back</button>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      {article.image_url && (
        <img src={article.image_url} alt={article.title} className="w-full h-80 object-cover rounded mb-6" />
      )}
      <div className="text-gray-500 mb-4">
        {article.published_date ? new Date(article.published_date).toLocaleDateString() : "Unpublished"}
      </div>
      <div className="prose prose-lg max-w-none mb-8">
        {article.content && (
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        )}
      </div>
    </div>
  );
};

export default NewsArticle; 