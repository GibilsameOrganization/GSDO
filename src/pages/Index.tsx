
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImpactMetrics from "@/components/ImpactMetrics";
import FocusAreas from "@/components/FocusAreas";
import StoriesCarousel from "@/components/StoriesCarousel";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Who We Are Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-6">
              Who We Are
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Gibilsame Sustainable Development Organization (GSDO) is an international NGO dedicated to creating 
              lasting change in communities worldwide. Through sustainable development initiatives, humanitarian aid, 
              and advocacy for social equity, we work to ensure that everyone has the opportunity to build a better future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Mission</h3>
                <p className="text-gray-600">Empowering communities through sustainable development and humanitarian action</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Vision</h3>
                <p className="text-gray-600">A world where all people have equal opportunities to thrive and prosper</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gsdo-black mb-2">Our Values</h3>
                <p className="text-gray-600">Integrity, inclusivity, innovation, and impact in everything we do</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImpactMetrics />
      <FocusAreas />
      <StoriesCarousel />
      <GetInvolvedSection />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Index;
