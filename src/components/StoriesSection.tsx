import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

interface StoriesContent {
  title: string;
  subtitle: string;
  ctaText: string;
}

type NewsArticle = Database["public"]["Tables"]["news_articles"]["Row"];

const StoriesSection = () => {
  const { sectionRefreshTriggers } = useContent();
  const navigate = useNavigate();
  const [content, setContent] = useState<StoriesContent>({
    title: 'LATEST NEWS & STORIES',
    subtitle: 'Read about our programs, people, and communities.',
    ctaText: 'SEE ALL STORIES',
  });
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchArticles();
  }, []);

  // Listen for content updates
  useEffect(() => {
    if (sectionRefreshTriggers['landing_stories']) {
      console.log('StoriesSection: Refresh triggered, refetching content...');
      fetchContent();
    }
  }, [sectionRefreshTriggers]);

  const fetchContent = async () => {
    try {
      console.log('StoriesSection: Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_stories')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('StoriesSection: Error fetching content:', error);
      } else if (data && data.content) {
        console.log('StoriesSection: Content fetched successfully:', data.content);
        const fetchedContent = data.content as any;
        setContent({
          title: fetchedContent.title || content.title,
          subtitle: fetchedContent.subtitle || content.subtitle,
          ctaText: fetchedContent.ctaText || content.ctaText,
        });
      } else {
        console.log('StoriesSection: No content found in database, using defaults');
      }
    } catch (error) {
      console.error('StoriesSection: Unexpected error fetching content:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      console.log('StoriesSection: Fetching news articles...');
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false })
        .limit(4); // Limit to 4 articles for the landing page

      if (error) {
        console.error('StoriesSection: Error fetching articles:', error);
      } else {
        console.log('StoriesSection: Articles fetched successfully:', data);
        setArticles(data || []);
      }
    } catch (error) {
      console.error('StoriesSection: Unexpected error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAllStories = () => {
    navigate('/news');
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/news/${articleId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4 max-w-2xl mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded mb-8 max-w-3xl mx-auto"></div>
              <div className="h-12 bg-gray-200 rounded max-w-48 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {content.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {content.subtitle}
          </p>
          <Button 
            className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg flex items-center space-x-2 mx-auto"
            onClick={handleSeeAllStories}
          >
            <span>{content.ctaText}</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No news articles found. Check back soon for updates.
            </div>
          ) : (
            articles.map((article, index) => (
              <div 
                key={article.id} 
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-600">
                    {article.category ? article.category.substring(0, 2).toUpperCase() : 'GS'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {article.published_date ? new Date(article.published_date).toLocaleDateString() : "Unpublished"}
                    </p>
                  </div>
                </div>
                {article.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection; 