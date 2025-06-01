
import { Heart, Droplets, Leaf, GraduationCap, Users, Shield } from "lucide-react";

const FocusAreas = () => {
  const areas = [
    {
      icon: Users,
      title: "Gender Equality",
      description: "Empowering women and girls through education, economic opportunities, and advocacy for equal rights.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Droplets,
      title: "Food & Water Security",
      description: "Ensuring access to clean water, sanitation, and sustainable food systems for all communities.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Leaf,
      title: "Climate & Environment",
      description: "Building resilience against climate change through sustainable practices and environmental protection.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Heart,
      title: "Health & Sanitation",
      description: "Improving healthcare access and promoting health education in underserved communities.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: GraduationCap,
      title: "Education & Youth",
      description: "Providing quality education and empowering young people to become agents of change.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Shield,
      title: "Emergency Response",
      description: "Rapid humanitarian aid and disaster relief to communities in crisis situations.",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Our Focus Areas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Working across multiple sectors to address the root causes of poverty and inequality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <div
                key={area.title}
                className={`p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${area.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gsdo-black mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-royal-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Learn More About Our Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
