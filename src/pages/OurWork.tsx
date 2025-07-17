
import Navigation from "@/components/Navigation";
import FocusAreas from "@/components/FocusAreas";
import ProgramsSection from "@/components/ProgramsSection";

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
      <ProgramsSection />
    </div>
  );
};

export default OurWork;
