import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { User } from '../types';

interface PremiumCTAProps {
  user: User | null;
  onUpgrade: () => void;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ user, onUpgrade }) => {
  if (user?.isPremium) {
    return null;
  }

  return (
    <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white text-center">
      <div className="flex justify-center items-center gap-2 mb-2">
        <Crown size={28} />
        <Sparkles size={24} />
      </div>
      <h3 className="font-bold text-lg mb-2">Unlock AI-Powered Growth</h3>
      <p className="text-sm mb-4 opacity-90">
        🧠 Smart motivational nudges<br/>
        💡 AI habit suggestions<br/>
        📊 Weekly insights & custom themes
      </p>
      <button 
        onClick={onUpgrade}
        className="bg-white text-purple-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
      >
        Upgrade - $2.99/month
      </button>
    </div>
  );
};

export default PremiumCTA;
