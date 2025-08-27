import React from 'react';
import { Crown, Sparkles, Zap, TrendingUp, Palette, Download, Brain } from 'lucide-react';
import { User } from '../types';

interface PremiumCTAProps {
  user: User | null;
  onUpgrade: () => void;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ user, onUpgrade }) => {
  if (user?.isPremium) {
    return (
      <div className="mt-6 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 p-8 rounded-3xl text-white text-center relative overflow-hidden shadow-xl">
        {/* Premium member card */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Crown size={32} className="text-white drop-shadow-lg" />
            <span className="text-xl font-bold tracking-wide">PREMIUM MEMBER</span>
          </div>
          <p className="text-white/90 text-lg font-medium">
            You're unlocking your full potential! 🚀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
      {/* Floating background elements */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-pink-500/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative">
              <Crown size={36} className="text-amber-300 drop-shadow-lg animate-bounce" />
              <Sparkles size={20} className="absolute -top-2 -right-2 text-pink-300 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Unlock AI-Powered Growth
          </h3>
          <p className="text-purple-100 text-lg font-medium">
            Transform your habits with intelligent insights
          </p>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Brain size={24} className="text-cyan-300" />
              <span className="font-semibold text-white">Smart AI</span>
            </div>
            <p className="text-purple-100 text-sm">Personalized motivational nudges</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} className="text-green-300" />
              <span className="font-semibold text-white">Analytics</span>
            </div>
            <p className="text-purple-100 text-sm">Weekly insights & progress</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Palette size={24} className="text-pink-300" />
              <span className="font-semibold text-white">Themes</span>
            </div>
            <p className="text-purple-100 text-sm">Custom beautiful themes</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Download size={24} className="text-amber-300" />
              <span className="font-semibold text-white">Export</span>
            </div>
            <p className="text-purple-100 text-sm">Download your data</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button 
            onClick={onUpgrade}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-pink-500/25 active:scale-95 border border-pink-400/50"
          >
            <div className="flex items-center gap-3">
              <Zap size={24} className="animate-pulse" />
              <span>Start Premium - $2.99/month</span>
            </div>
          </button>
          <p className="text-purple-200 text-sm mt-3 font-medium">
            ✨ 7-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumCTA;
