import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="min-h-screen relative">
      {/* Grid background matching landing page */}
      <div className="grid-background"></div>
      
      <div className="relative z-10 container mx-auto pt-32 pb-20 px-4 md:px-6">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
