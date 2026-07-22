import { useState, useEffect } from 'react';
import LoadingIntro from '@/components/LoadingIntro';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import QuoteSection from '@/components/QuoteSection';
import SocialSection from '@/components/SocialSection';
import FinalSection from '@/components/FinalSection';
import AmbientSound from '@/components/AmbientSound';
import ThemeToggle from '@/components/ThemeToggle';
import KineticGrid from '@/components/ui/kinetic-grid';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <KineticGrid globalColor="default" className="min-h-screen">
      {/* Loading Intro */}
      {isLoading && <LoadingIntro onComplete={handleLoadingComplete} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Navigation */}
        <Navbar />

        {/* Main Sections */}
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <QuoteSection />
          <SocialSection />
          <FinalSection />
        </main>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Ambient Sound Toggle */}
        <AmbientSound />
      </div>
    </KineticGrid>
  );
};

export default Index;
