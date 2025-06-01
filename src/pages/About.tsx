
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About GSDO</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Founded on the belief that sustainable development is the pathway to lasting peace and prosperity
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl leading-relaxed mb-6">
                Gibilsame Sustainable Development Organization was founded in 2009 by a group of passionate 
                development practitioners who believed that lasting change could only come through community-driven, 
                sustainable approaches to development.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Starting with a small water project in rural Mali, GSDO has grown into a global organization 
                working across multiple continents. Our approach has always been rooted in the belief that 
                communities themselves are the best agents of their own development, and our role is to provide 
                the tools, resources, and support they need to create lasting change.
              </p>
              <p className="text-lg leading-relaxed">
                Today, GSDO operates in over 25 countries, working directly with local communities, governments, 
                and partner organizations to address the root causes of poverty and inequality through integrated 
                development programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Amina Hassan",
                title: "Executive Director",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088&auto=format&fit=crop"
              },
              {
                name: "James Mitchell",
                title: "Director of Programs",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2087&auto=format&fit=crop"
              },
              {
                name: "Dr. Priya Sharma",
                title: "Director of Research",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop"
              }
            ].map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gsdo-black mb-2">{member.name}</h3>
                  <p className="text-royal-blue font-medium">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
