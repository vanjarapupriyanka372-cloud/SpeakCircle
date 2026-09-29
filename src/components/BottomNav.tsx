import React from 'react';
import { MessageSquare, Compass, Bot, Sparkles, TrendingUp, User } from 'lucide-react';

export type NavTab = 'home' | 'discover' | 'chat' | 'practice' | 'progress' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: MessageSquare },
    { id: 'discover' as NavTab, label: 'Discover', icon: Compass },
    { id: 'chat' as NavTab, label: 'Chat Board', icon: Bot, isHighlighted: true },
    { id: 'practice' as NavTab, label: 'Practice', icon: Sparkles },
    { id: 'progress' as NavTab, label: 'Progress', icon: TrendingUp },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/90 bg-white/95 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto grid max-w-lg grid-cols-6 items-center px-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex min-h-[52px] min-w-[40px] flex-col items-center justify-center py-1.5 transition-colors focus:outline-hidden"
              aria-label={tab.label}
            >
              <div
                className={`relative flex items-center justify-center rounded-xl p-1 transition-all ${
                  isActive
                    ? 'text-emerald-700 font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.isHighlighted && (
                  <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <span
                className={`text-[10px] leading-tight tracking-tight text-center truncate max-w-full px-0.5 ${
                  isActive ? 'font-semibold text-emerald-800' : 'font-normal text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
