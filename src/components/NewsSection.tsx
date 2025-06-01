
const NewsSection = () => {
  const articles = [
    {
      image: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?q=80&w=2065&auto=format&fit=crop",
      category: "Water & Sanitation",
      title: "New Water Project Brings Hope to Drought-Affected Region",
      excerpt: "Our latest initiative provides clean water access to 50,000 people in the Horn of Africa, offering relief during the ongoing drought crisis.",
      date: "November 28, 2024",
      readTime: "5 min read"
    },
    {
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2069&auto=format&fit=crop",
      category: "Education",
      title: "Scholarship Program Graduates 200 Young Leaders",
      excerpt: "Celebrating the achievements of our scholarship recipients who are now leading change in their communities across three continents.",
      date: "November 25, 2024",
      readTime: "3 min read"
    },
    {
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
      category: "Climate Action",
      title: "Solar Initiative Powers 100 Remote Health Clinics",
      excerpt: "Renewable energy project ensures uninterrupted healthcare services in remote areas while reducing carbon footprint.",
      date: "November 22, 2024",
      readTime: "4 min read"
    }
  ];

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
          {articles.map((article, index) => (
            <article
              key={article.title}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-royal-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gsdo-black mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                
                <button className="text-royal-blue hover:text-blue-700 font-semibold transition-colors">
                  Read More →
                </button>
              </div>
            </article>
          ))}
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
