
import { useState, useEffect, useRef } from "react";

const ImpactMetrics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    lives: 0,
    projects: 0,
    communities: 0,
    years: 0
  });

  const sectionRef = useRef<HTMLDivElement>(null);

  const finalCounts = {
    lives: 2500000,
    projects: 450,
    communities: 1200,
    years: 15
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounts({
          lives: Math.floor(finalCounts.lives * progress),
          projects: Math.floor(finalCounts.projects * progress),
          communities: Math.floor(finalCounts.communities * progress),
          years: Math.floor(finalCounts.years * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounts(finalCounts);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

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
      description: "People reached through our programs"
    },
    {
      count: counts.projects.toLocaleString(),
      label: "Projects Completed",
      description: "Sustainable development initiatives"
    },
    {
      count: counts.communities.toLocaleString(),
      label: "Communities Served",
      description: "Villages and towns transformed"
    },
    {
      count: counts.years.toString(),
      label: "Years of Impact",
      description: "Dedicated to sustainable development"
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Our Global Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Measuring success through the lives we touch and the communities we transform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`text-center p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-royal-blue mb-2">
                {metric.count}
              </div>
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">
                {metric.label}
              </h3>
              <p className="text-gray-600">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
