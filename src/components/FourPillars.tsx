import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/contexts/ContentContext";

interface Pillar {
  title: string;
  description: string;
  image: string;
}

interface FourPillarsContent {
  pillar1: Pillar;
  pillar2: Pillar;
  pillar3: Pillar;
  pillar4: Pillar;
}

const FourPillars = () => {
  const [pillars, setPillars] = useState<Pillar[]>([
    {
      title: "WE ACT WITH INTEGRITY",
      description: "We earn trust by operating with full transparency and accountability—ensuring every action reflects our values and ethical commitment to the communities we serve.",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE INCLUSIVE",
      description: "We believe every voice matters. Our programs are designed to uplift marginalized groups, promote equality, and create space for all to participate and thrive.",
      image: "https://images.unsplash.com/photo-1524250609324-3030cdb213d3?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE EFFICIENT",
      description: "Your donation does more when you give it to GSDO. 90% of the money GSDO spends goes toward our sustainable development work that transforms communities.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60"
    },
    {
      title: "WE'RE TRUSTED",
      description: "With over 15 years of service, GSDO has built trust through sustainable development and advocacy for social equity.",
      image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=400&q=60"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const { sectionRefreshTriggers } = useContent();

  useEffect(() => {
    fetchFourPillarsContent();
  }, [sectionRefreshTriggers.landing_four_pillars]);

  const fetchFourPillarsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_four_pillars')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching four pillars content:', error);
      } else if (data && data.content) {
        const fourPillarsContent = data.content as any;
        const newPillars = [
          fourPillarsContent.pillar1 || pillars[0],
          fourPillarsContent.pillar2 || pillars[1],
          fourPillarsContent.pillar3 || pillars[2],
          fourPillarsContent.pillar4 || pillars[3],
        ];
        setPillars(newPillars);
      }
    } catch (error) {
      console.error('Unexpected error fetching four pillars content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to clean HTML tags from text
  const cleanText = (text: string) => {
    return text.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <section 
        style={{
          background: '#ffffff',
          color: '#000000',
          padding: '4rem 1rem 5rem'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div style={{
                  height: '250px',
                  background: '#e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '0'
                }}></div>
                <div style={{
                  height: '120px',
                  background: '#0056d9',
                  borderRadius: '0 0 8px 8px',
                  marginTop: '0'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      style={{
        background: '#ffffff',
        color: '#000000',
        padding: '4rem 1rem 5rem'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Four Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Image Section */}
              <div style={{
                height: '250px',
                overflow: 'hidden'
              }}>
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.error('Failed to load pillar image:', pillar.image);
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=60";
                  }}
                />
              </div>

              {/* Text Section */}
              <div style={{
                background: '#0056d9',
                color: '#ffffff',
                padding: '1.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {cleanText(pillar.title)}
                </h3>
                <div style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0
                }}>
                  {cleanText(pillar.description)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourPillars; 