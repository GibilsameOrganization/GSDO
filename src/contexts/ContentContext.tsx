
import React, { createContext, useContext, useState, useCallback } from 'react';

interface ContentContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  refreshSection: (sectionKey: string) => void;
  sectionRefreshTriggers: Record<string, number>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sectionRefreshTriggers, setSectionRefreshTriggers] = useState<Record<string, number>>({});

  const triggerRefresh = useCallback(() => {
    console.log('ContentContext: Triggering global content refresh');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const refreshSection = useCallback((sectionKey: string) => {
    console.log('ContentContext: Triggering refresh for section:', sectionKey);
    setSectionRefreshTriggers(prev => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || 0) + 1
    }));
    // Also trigger global refresh
    triggerRefresh();
  }, [triggerRefresh]);

  const value = {
    refreshTrigger,
    triggerRefresh,
    refreshSection,
    sectionRefreshTriggers,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};
