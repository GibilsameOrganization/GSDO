import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const iconMap: Record<string, string> = {
  lives: "👥",
  projects: "🏗️",
  communities: "🏘️",
  years: "⏰",
};

const ImpactMetrics = () => {
  const [metrics, setMetrics] = useState<Database["public"]["Tables"]["impact_metrics"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase
        .from("impact_metrics")
        .select("*")
        .eq("active", true)
        .order("order_index");
      if (error) {
        setErrorMsg("Error fetching metrics: " + error.message);
        setMetrics([]);
        console.error("ImpactMetrics fetch error:", error);
      } else if (!data || data.length === 0) {
        setErrorMsg("No active impact metrics found. Please check the admin panel and database.");
        setMetrics([]);
      } else {
        setMetrics(data);
      }
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  // Start number animation once metrics fetched
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  useEffect(() => {
    if (metrics.length > 0) {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;
      let step = 0;
      const endValues = metrics.map((m) => m.value);
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setAnimatedValues(
          endValues.map((end) => Math.floor(end * easeProgress))
        );
        if (step >= steps) {
          clearInterval(timer);
          setAnimatedValues(endValues);
        }
      }, stepDuration);
      return () => clearInterval(timer);
    }
  }, [metrics]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gsdo-black mb-4 md:mb-6">Our Global Impact</h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8">Loading impact metrics...</p>
        </div>
      </section>
    );
  }

  if (errorMsg) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gsdo-black mb-4 md:mb-6">Our Global Impact</h2>
          <p className="text-base md:text-lg lg:text-xl text-red-600 max-w-3xl mx-auto mb-8">{errorMsg}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={elementRef} className="py-12 md:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gsdo-black mb-4 md:mb-6">Our Global Impact</h2>
          <div className="w-16 md:w-24 h-1 bg-royal-blue mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Measuring success through the lives we touch and the communities we transform across the globe
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.id}
              className="text-center p-4 md:p-6 lg:p-8 bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 group border border-gray-100"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                {iconMap[metric.metric_key] || "✨"}
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-royal-blue mb-2 md:mb-3 group-hover:text-blue-700 transition-colors">
                {formatNumber(animatedValues[index] ?? 0)}
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gsdo-black mb-2 md:mb-3">
                {metric.label}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {metric.description}
              </p>
              <div className="mt-3 md:mt-4 w-8 md:w-12 h-0.5 bg-royal-blue mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
