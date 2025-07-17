
import Navigation from "@/components/Navigation";
import NewsSection from "@/components/NewsSection";

const News = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Stories</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Stay updated on our latest projects, impact stories, and global development insights
            </p>
          </div>
        </div>
      </section>

      <NewsSection />

      {/* Blog Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Field Stories",
              "Project Updates", 
              "Research",
              "Partnerships",
              "Events",
              "Policy"
            ].map((category) => (
              <button
                key={category}
                className="bg-light-gray hover:bg-royal-blue hover:text-white py-3 px-4 rounded-lg font-medium transition-colors text-center"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
