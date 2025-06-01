
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GetInvolvedSection from "@/components/GetInvolvedSection";

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

      {/* Volunteer Opportunities */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-12 text-center">Current Volunteer Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Field Program Assistant",
                location: "Kenya",
                duration: "6-12 months",
                description: "Support water and sanitation projects in rural communities"
              },
              {
                title: "Education Coordinator",
                location: "Bangladesh",
                duration: "12 months",
                description: "Help implement girls' education programs and community outreach"
              },
              {
                title: "Digital Marketing Volunteer",
                location: "Remote",
                duration: "3-6 months",
                description: "Create content and manage social media campaigns"
              },
              {
                title: "Grant Writer",
                location: "Remote",
                duration: "Ongoing",
                description: "Research and write funding proposals for development projects"
              },
              {
                title: "Translation Services",
                location: "Remote",
                duration: "Flexible",
                description: "Translate documents and materials into local languages"
              },
              {
                title: "Monitoring & Evaluation",
                location: "Guatemala",
                duration: "6 months",
                description: "Assess impact and effectiveness of climate resilience programs"
              }
            ].map((opportunity) => (
              <div key={opportunity.title} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gsdo-black mb-2">{opportunity.title}</h3>
                <div className="text-sm text-royal-blue mb-4">
                  {opportunity.location} • {opportunity.duration}
                </div>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <button className="w-full bg-royal-blue hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetInvolved;
