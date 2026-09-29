import React from 'react';
import { ShieldCheck, ShieldAlert, Bot } from 'lucide-react';

interface TopNavProps {
  onOpenSafety: () => void;
  onOpenAdmin: () => void;
  onOpenChat?: () => void;
  activeScreen: string;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenSafety, onOpenAdmin, onOpenChat, activeScreen }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
            <span className="font-display text-lg tracking-tight">S</span>
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-stone-900">
              SpeakCircle
            </span>
          </div>
        </div>

        {/* Zone 2: Privacy Guarantee unboxed text */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          <span>1-to-1 English Practice</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Zero Personal Data Shared</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>Pan-India</span>
        </div>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium shadow-xs transition-all active:scale-95 ${
                activeScreen === 'chat'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
              }`}
              title="AI English Chat Board"
            >
              <Bot className="h-3.5 w-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Chat Board</span>
            </button>
          )}

          <button
            onClick={onOpenSafety}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 shadow-xs hover:bg-stone-50 active:scale-95 transition-all"
            title="Safety Center & Privacy"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Safety Center</span>
            <span className="sm:hidden">Safety</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 active:scale-95 transition-all"
            title="Moderation Console"
          >
            <ShieldAlert className="h-4 w-4 text-amber-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
