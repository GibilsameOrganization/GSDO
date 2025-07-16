import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MissionContent {
  statement: string;
}

const MissionStatement = () => {
  const [content, setContent] = useState<MissionContent>({
    statement: 'Every day, together with you, GSDO empowers communities and helps millions of people build sustainable futures worldwide.',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissionContent();
  }, []);

  const fetchMissionContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'landing_mission')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching mission content:', error);
      } else if (data && data.content) {
        const missionContent = data.content as any;
        setContent({
          statement: missionContent.statement || content.statement,
        });
      }
    } catch (error) {
      console.error('Unexpected error fetching mission content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="strapline"
        style={{
          padding: '4rem 1rem',
          textAlign: 'center',
          fontSize: '1.35rem',
          fontWeight: '700',
          maxWidth: '840px',
          marginInline: 'auto'
        }}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="strapline"
      style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        fontSize: '1.35rem',
        fontWeight: '700',
        maxWidth: '840px',
        marginInline: 'auto'
      }}
    >
      {content.statement}
    </div>
  );
};

export default MissionStatement; 