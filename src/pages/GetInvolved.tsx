
import Navigation from "@/components/Navigation";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import VolunteerOpportunitiesSection from "@/components/VolunteerOpportunitiesSection";

const GetInvolved = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Get Involved</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Join us in creating lasting change. Every action, no matter how small, makes a difference.
            </p>
          </div>
        </div>
      </section>

      <GetInvolvedSection />

      <VolunteerOpportunitiesSection />
    </div>
  );
};

export default GetInvolved;
