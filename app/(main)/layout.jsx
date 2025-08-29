import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="min-h-screen relative">
      {/* Grid background matching landing page */}
      <div className="grid-background"></div>
      
      <div className="relative z-10 container mx-auto mobile-container mobile-spacing mobile-header-offset pb-12 sm:pb-16 md:pb-20">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
