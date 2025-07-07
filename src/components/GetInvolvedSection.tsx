import { Heart, Users, Megaphone, DollarSign, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GetInvolvedSection = () => {
  const navigate = useNavigate();

  const ways = [
    {
      icon: DollarSign,
      title: "Donate",
      description: "Your contribution directly funds life-changing programs in communities worldwide.",
      action: "Give Today",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      onClick: () => navigate('/donate')
    },
    {
      icon: Heart,
      title: "Volunteer",
      description: "Join our global network of volunteers making a difference in local and international projects.",
      action: "Join Us",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      onClick: () => navigate('/get-involved')
    },
    {
      icon: Users,
      title: "Partner",
      description: "Collaborate with us as an organization, business, or institution to amplify our impact.",
      action: "Partner With Us",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      onClick: () => navigate('/contact')
    },
    {
      icon: Megaphone,
      title: "Advocate",
      description: "Raise awareness and speak up for social justice and sustainable development in your community.",
      action: "Spread the Word",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      onClick: () => navigate('/news')
    },
    {
      icon: Mail,
      title: "Stay Informed",
      description: "Subscribe to our newsletter for updates on our work and ways to get involved.",
      action: "Subscribe",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      onClick: () => navigate('/contact')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            How You Can Help
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every action matters. Choose how you want to be part of the solution and help create lasting change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ways.map((way, index) => {
            const IconComponent = way.icon;
            return (
              <div
                key={way.title}
                className={`p-6 rounded-lg border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-fade-in ${way.color}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-royal-blue rounded-lg flex items-center justify-center mr-4">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gsdo-black">
                    {way.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {way.description}
                </p>
                <button 
                  onClick={way.onClick}
                  className="w-full bg-royal-blue hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  {way.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
