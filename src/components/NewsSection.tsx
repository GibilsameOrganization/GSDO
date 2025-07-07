import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

const NewsSection = () => {
  const [articles, setArticles] = useState<Database["public"]["Tables"]["news_articles"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("status", "published")
        .order("published_date", { ascending: false });
      if (!error && data) {
        setArticles(data);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">Latest News & Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Loading news...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Latest News & Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated on our recent projects, impact stories, and global development news
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No news articles found.</div>
          ) : (
            articles.map((article, index) => (
              <article
                key={article.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={article.image_url || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-royal-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gsdo-black mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{article.published_date ? new Date(article.published_date).toLocaleDateString() : "Unpublished"}</span>
                  </div>
                  <button
                    className="text-royal-blue hover:text-blue-700 font-semibold transition-colors"
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    Read More →
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <div className="text-center mt-12">
          <button className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All News & Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
