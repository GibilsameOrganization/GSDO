
import { useState, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const ImpactMetrics = () => {
  const [counts, setCounts] = useState({
    lives: 0,
    projects: 0,
    communities: 0,
    years: 0
  });

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const finalCounts = {
    lives: 2500000,
    projects: 450,
    communities: 1200,
    years: 15
  };

  useEffect(() => {
    if (isIntersecting) {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        setCounts({
          lives: Math.floor(finalCounts.lives * easeProgress),
          projects: Math.floor(finalCounts.projects * easeProgress),
          communities: Math.floor(finalCounts.communities * easeProgress),
          years: Math.floor(finalCounts.years * easeProgress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounts(finalCounts);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isIntersecting]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toLocaleString();
  };

  const metrics = [
    {
      count: formatNumber(counts.lives),
      label: "Lives Impacted",
      description: "People reached through our programs",
      icon: "👥"
    },
    {
      count: counts.projects.toLocaleString(),
      label: "Projects Completed",
      description: "Sustainable development initiatives",
      icon: "🏗️"
    },
    {
      count: counts.communities.toLocaleString(),
      label: "Communities Served",
      description: "Villages and towns transformed",
      icon: "🏘️"
    },
    {
      count: counts.years.toString(),
      label: "Years of Impact",
      description: "Dedicated to sustainable development",
      icon: "⏰"
    }
  ];

  return (
    <section ref={elementRef} className="py-20 bg-gradient-to-br from-light-gray to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gsdo-black mb-6">
            Our Global Impact
          </h2>
          <div className="w-24 h-1 bg-royal-blue mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Measuring success through the lives we touch and the communities we transform across the globe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 group border border-gray-100 ${
                isIntersecting ? "animate-scale-in" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-royal-blue mb-3 group-hover:text-blue-700 transition-colors">
                {metric.count}
              </div>
              <h3 className="text-xl font-semibold text-gsdo-black mb-3">
                {metric.label}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {metric.description}
              </p>
              <div className="mt-4 w-12 h-0.5 bg-royal-blue mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
