import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageLayout from "@/components/PageLayout";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const OurWork = React.lazy(() => import("./pages/OurWork"));
const GetInvolved = React.lazy(() => import("./pages/GetInvolved"));
const News = React.lazy(() => import("./pages/News"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Donate = React.lazy(() => import("./pages/Donate"));
const DonationConfirmation = React.lazy(() => import("./pages/DonationConfirmation"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const NewsArticle = React.lazy(() => import("./pages/NewsArticle"));
const StoryDetail = React.lazy(() => import("./pages/StoryDetail"));
const VolunteerOpportunityDetail = React.lazy(() => import("./pages/VolunteerOpportunityDetail"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<PageLayout><About /></PageLayout>} />
                  <Route path="/our-work" element={<PageLayout><OurWork /></PageLayout>} />
                  <Route path="/get-involved" element={<PageLayout><GetInvolved /></PageLayout>} />
                  <Route path="/news" element={<PageLayout><News /></PageLayout>} />
                  <Route path="/news/:id" element={<PageLayout><NewsArticle /></PageLayout>} />
                  <Route path="/stories/:id" element={<PageLayout><StoryDetail /></PageLayout>} />
                  <Route path="/opportunities/:id" element={<PageLayout><VolunteerOpportunityDetail /></PageLayout>} />
                  <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
                  <Route path="/donate" element={<PageLayout><Donate /></PageLayout>} />
                  <Route path="/donation-confirmation" element={<PageLayout><DonationConfirmation /></PageLayout>} />
                  <Route path="/auth" element={<PageLayout><Auth /></PageLayout>} />
                  <Route 
                    path="/manage" 
                    element={
                      <ProtectedRoute adminOnly>
                        <PageLayout><Admin /></PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  {/* /admin path does NOT exist - will return 404 */}
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ContentProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
