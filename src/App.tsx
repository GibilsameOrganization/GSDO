import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

// Lazy load pages
const Index = React.lazy(() => import("./pages/Index"));
const About = React.lazy(() => import("./pages/About"));
const OurWork = React.lazy(() => import("./pages/OurWork"));
const GetInvolved = React.lazy(() => import("./pages/GetInvolved"));
const News = React.lazy(() => import("./pages/News"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => (
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
                <Route path="/about" element={<About />} />
                <Route path="/our-work" element={<OurWork />} />
                <Route path="/get-involved" element={<GetInvolved />} />
                <Route path="/news" element={<News />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ContentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
