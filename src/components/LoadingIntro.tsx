import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface LoadingIntroProps {
  onComplete: () => void;
}

const LoadingIntro = ({ onComplete }: LoadingIntroProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadingProgress >= 100) {
      setTimeout(() => setShowWelcome(true), 500);
      setTimeout(() => {
        gsap.to('.loading-container', {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete
        });
      }, 2500);
    }
  }, [loadingProgress, onComplete]);

  const codeLines = [
    'const portfolio = new Portfolio();',
    'portfolio.loadSkills([...]);',
    'portfolio.initProjects();',
    'await portfolio.render();',
  ];

  return (
    <div className="loading-container fixed inset-0 z-50 flex items-center justify-center gradient-cinematic overflow-hidden">
      {/* Studio Background */}
      <div className="absolute inset-0 studio-light" />
      
      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationName: 'float-gentle',
              animationDuration: `${4 + Math.random() * 4}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Studio Table */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-secondary/50 to-transparent" />

      {/* Laptop Container */}
      <div className="relative perspective-1000">
        <div 
          className="laptop-wrapper animate-laptop-fall"
          style={{ perspective: '1000px' }}
        >
          {/* Laptop Base */}
          <div className="relative">
            {/* Laptop Screen */}
            <div 
              className="laptop-screen w-80 md:w-96 h-52 md:h-60 rounded-t-lg overflow-hidden relative"
              style={{
                transformOrigin: 'bottom center',
                animationName: loadingProgress > 10 ? 'laptop-open' : 'none',
                animationDuration: '1s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: '0.5s',
              }}
            >
              {/* Screen Content */}
              <div 
                className="absolute inset-0 p-4 flex flex-col justify-between"
                style={{
                  animationName: loadingProgress > 30 ? 'screen-on' : 'none',
                  animationDuration: '0.8s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: '1s',
                  opacity: loadingProgress > 30 ? 1 : 0,
                }}
              >
                {/* Code Editor Mock */}
                <div className="flex-1 space-y-2 overflow-hidden">
                  {codeLines.map((line, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs font-mono"
                      style={{
                        opacity: loadingProgress > 40 + index * 10 ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                      }}
                    >
                      <span className="text-muted-foreground">{index + 1}</span>
                      <span className="text-primary">{line}</span>
                      {index === codeLines.length - 1 && loadingProgress < 100 && (
                        <span className="w-2 h-4 bg-primary animate-blink" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Timeline Mock */}
                <div className="mt-4 space-y-1">
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-sm bg-primary/30"
                        style={{
                          width: `${20 + Math.random() * 30}px`,
                          opacity: loadingProgress > 50 + i * 3 ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-sm bg-accent/30"
                        style={{
                          width: `${30 + Math.random() * 40}px`,
                          opacity: loadingProgress > 60 + i * 4 ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Loading Bar */}
                <div className="mt-4">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full loading-bar rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Loading assets... {Math.round(Math.min(loadingProgress, 100))}%
                  </p>
                </div>
              </div>
            </div>

            {/* Laptop Keyboard/Base */}
            <div className="w-80 md:w-96 h-3 bg-secondary rounded-b-lg relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-muted/50 to-transparent" />
            </div>
            
            {/* Laptop Stand */}
            <div className="w-24 h-2 mx-auto bg-secondary/80 rounded-b-lg" />
          </div>
        </div>

        {/* Welcome Text */}
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
          <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-light hero-text mb-2 text-foreground">
                Welcome to My Portfolio
              </h1>
              <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* Soft Ambient Glow */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl pulse-glow" />
    </div>
  );
};

export default LoadingIntro;
