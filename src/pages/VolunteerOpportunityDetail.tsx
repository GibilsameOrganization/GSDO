import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Calendar, ExternalLink, ArrowLeft, Users, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import CareFooter from "@/components/CareFooter";

type VolunteerOpportunity = Database["public"]["Tables"]["volunteer_opportunities"]["Row"];

const VolunteerOpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) {
        setError("No opportunity ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("volunteer_opportunities")
        .select("*")
        .eq("id", id)
        .eq("active", true)
        .eq("status", "active")
        .single();

      if (error) {
        setError("Error fetching opportunity: " + error.message);
        setOpportunity(null);
      } else if (!data) {
        setError("Opportunity not found");
        setOpportunity(null);
      } else {
        setOpportunity(data);
      }
      setLoading(false);
    };

    fetchOpportunity();
  }, [id]);

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
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gsdo-black mb-4">Loading Opportunity...</h1>
            <p className="text-gray-600">Please wait while we fetch the details.</p>
          </div>
        </div>
        <CareFooter />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-light-gray">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gsdo-black mb-4">Opportunity Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The opportunity you're looking for doesn't exist or is no longer available."}</p>
            <Button onClick={() => navigate('/get-involved')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>
          </div>
        </div>
        <CareFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/get-involved')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Opportunities
          </Button>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Badge className={`${getTypeColor(opportunity.type)} mb-4`}>
                {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{opportunity.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{opportunity.duration}</span>
                </div>
                {opportunity.category && (
                  <Badge variant="outline" className="text-blue-100 border-blue-200">
                    {opportunity.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gsdo-black">About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-700 leading-relaxed text-lg prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: opportunity.description }}
                  />
                </CardContent>
              </Card>

              {opportunity.requirements && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gsdo-black">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: opportunity.requirements }}
                    />
                  </CardContent>
                </Card>
              )}

              {opportunity.benefits && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gsdo-black">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: opportunity.benefits }}
                    />
                  </CardContent>
                </Card>
              )}

              {opportunity.tags && opportunity.tags.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gsdo-black">Skills & Focus Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gsdo-black">Apply Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Details */}
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600">{opportunity.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-gray-500" />
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-600">{opportunity.duration}</div>
                      </div>
                    </div>

                    {opportunity.start_date && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <div className="font-medium">Start Date</div>
                          <div className="text-gray-600">{formatDate(opportunity.start_date)}</div>
                        </div>
                      </div>
                    )}

                    {opportunity.end_date && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                        <div>
                          <div className="font-medium">End Date</div>
                          <div className="text-gray-600">{formatDate(opportunity.end_date)}</div>
                        </div>
                      </div>
                    )}

                    {opportunity.application_deadline && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-red-500" />
                        <div>
                          <div className="font-medium text-red-600">Application Deadline</div>
                          <div className="text-red-600 font-medium">{formatDate(opportunity.application_deadline)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  {(opportunity.contact_email || opportunity.contact_phone) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gsdo-black">Contact Information</h4>
                      
                      {opportunity.contact_email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-3 text-gray-500" />
                          <div>
                            <div className="font-medium">Email</div>
                            <a 
                              href={`mailto:${opportunity.contact_email}?subject=Application for ${opportunity.title}`}
                              className="text-royal-blue hover:underline"
                            >
                              {opportunity.contact_email}
                            </a>
                          </div>
                        </div>
                      )}

                      {opportunity.contact_phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-3 text-gray-500" />
                          <div>
                            <div className="font-medium">Phone</div>
                            <a 
                              href={`tel:${opportunity.contact_phone}`}
                              className="text-royal-blue hover:underline"
                            >
                              {opportunity.contact_phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Separator />

                  {/* Application Button */}
                  <div className="space-y-3">
                    {opportunity.application_url ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => window.open(opportunity.application_url!, '_blank')}
                      >
                        Apply Online
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    ) : opportunity.contact_email ? (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => window.open(`mailto:${opportunity.contact_email}?subject=Application for ${opportunity.title}`, '_blank')}
                      >
                        Apply via Email
                        <Mail className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => navigate('/contact')}
                      >
                        Contact Us to Apply
                        <Users className="w-4 h-4 ml-2" />
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/get-involved')}
                    >
                      View Other Opportunities
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CareFooter />
    </div>
  );
};

export default VolunteerOpportunityDetail; 