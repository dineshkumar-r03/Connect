import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen inner-page-bg" style={{ position: 'relative' }}>
      {/* Animated floating orbs — shared across all inner pages */}
      <div className="animated-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <Navbar />
      <main className="pt-20 pb-12 content-layer">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;