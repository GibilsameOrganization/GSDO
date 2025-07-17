import React from "react";
import CareFooter from "./CareFooter";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <CareFooter />
    </div>
  );
};

export default PageLayout; 