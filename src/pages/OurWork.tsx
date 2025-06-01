
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FocusAreas from "@/components/FocusAreas";

const OurWork = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Work</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Comprehensive programs addressing the interconnected challenges of sustainable development
            </p>
          </div>
        </div>
      </section>

      <FocusAreas />

      {/* Programs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Current Programs</h2>
          <div className="space-y-12">
            {[
              {
                title: "Clean Water for All Initiative",
                description: "Providing sustainable water solutions to rural communities across sub-Saharan Africa",
                impact: "500,000 people served",
                countries: "Mali, Burkina Faso, Niger",
                image: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?q=80&w=2065&auto=format&fit=crop"
              },
              {
                title: "Girls Education Champions",
                description: "Breaking barriers to education for girls through scholarships and community advocacy",
                impact: "10,000 girls in school",
                countries: "Bangladesh, Pakistan, Afghanistan",
                image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=2069&auto=format&fit=crop"
              },
              {
                title: "Climate Resilience Network",
                description: "Building community capacity to adapt to and mitigate climate change impacts",
                impact: "200 communities trained",
                countries: "Kenya, Guatemala, Philippines",
                image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
              }
            ].map((program, index) => (
              <div key={program.title} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <img src={program.image} alt={program.title} className="w-full h-64 object-cover rounded-lg" />
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h3 className="text-2xl font-bold text-gsdo-black mb-4">{program.title}</h3>
                  <p className="text-gray-600 text-lg mb-6">{program.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-royal-blue">Impact</span>
                      <p className="text-gsdo-black font-semibold">{program.impact}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-royal-blue">Countries</span>
                      <p className="text-gsdo-black font-semibold">{program.countries}</p>
                    </div>
                  </div>
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

export default OurWork;
