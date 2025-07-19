import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Calendar, ExternalLink, Users } from "lucide-react";

type VolunteerOpportunity = Database["public"]["Tables"]["volunteer_opportunities"]["Row"];

const VolunteerOpportunitiesSection = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("volunteer_opportunities")
        .select("*")
        .eq("active", true)
        .eq("status", "active")
        .order("order_index", { ascending: true });

      if (error) {
        setError("Error fetching opportunities: " + error.message);
        setOpportunities([]);
      } else {
        setOpportunities(data || []);
      }
      setLoading(false);
    };

    fetchOpportunities();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer':
        return 'bg-blue-100 text-blue-800';
      case 'internship':
        return 'bg-green-100 text-green-800';
      case 'job':
        return 'bg-purple-100 text-purple-800';
      case 'tender':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
              Current Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading opportunities...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
              Current Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unable to load opportunities at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gsdo-black mb-4">
            Current Volunteer Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our global network of volunteers making a difference in communities worldwide
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We don't have any volunteer opportunities at the moment. Please check back later or contact us for other ways to get involved.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className={getTypeColor(opportunity.type)}>
                      {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                    </Badge>
                    {opportunity.category && (
                      <Badge variant="outline" className="text-xs">
                        {opportunity.category}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gsdo-black line-clamp-2">
                    {opportunity.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{opportunity.duration}</span>
                    </div>
                    {opportunity.start_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Starts: {formatDate(opportunity.start_date)}</span>
                      </div>
                    )}
                    {opportunity.application_deadline && (
                      <div className="flex items-center text-sm text-red-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Deadline: {formatDate(opportunity.application_deadline)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: opportunity.description }}
                    />
                  </div>

                  {opportunity.requirements && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Requirements:</h4>
                      <div 
                        className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: opportunity.requirements }}
                      />
                    </div>
                  )}

                  {opportunity.benefits && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Benefits:</h4>
                      <div 
                        className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: opportunity.benefits }}
                      />
                    </div>
                  )}

                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {opportunity.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {opportunity.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{opportunity.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                    >
                      Read More
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Don't see a position that fits? We're always looking for passionate individuals to join our team.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/contact'}>
            Contact Us About Volunteering
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VolunteerOpportunitiesSection; 