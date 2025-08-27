import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Single gentle fade-in after a brief pause
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className={`text-center max-w-sm transition-all duration-1000 ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Simple hand-drawn style illustration */}
        <div className="mb-8">
          <div className="text-6xl mb-4 transition-transform duration-300 hover:scale-110">
            ☀️
          </div>
          <div className="relative">
            <div className="text-2xl">🌱</div>
            <div className="absolute -top-1 -right-2 text-lg animate-pulse">✨</div>
          </div>
        </div>

        {/* Simple, warm typography */}
        <h1 className="text-3xl font-bold text-stone-900 mb-3 font-serif">
          MicroHabit
        </h1>
        
        <p className="text-lg text-stone-600 mb-8 leading-relaxed">
          Track 3 habits a day.<br/>
          Keep it simple.
        </p>

        {/* Single, clear CTA button */}
        <button 
          onClick={onGetStarted}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          Start tracking
        </button>

        {/* Subtle encouraging text */}
        <p className="text-sm text-stone-500 mt-6">
          No streaks to lose. Just progress to gain.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
