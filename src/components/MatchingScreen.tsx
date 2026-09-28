import React, { useEffect, useState } from 'react';
import { ConversationMode, RegionPreference, ConversationPartner } from '../types';
import { speakCircleService } from '../services/store';
import { X, ShieldCheck, Sparkles, Globe } from 'lucide-react';

interface MatchingScreenProps {
  mode: ConversationMode;
  regionPref: RegionPreference;
  duration: number;
  fearFree: boolean;
  onMatched: (partner: ConversationPartner) => void;
  onCancel: () => void;
}

const TIPS = [
  'It is completely okay to take a moment to formulate your thoughts.',
  'Your partner is also practicing to overcome their hesitation. You are both in this together.',
  'If there is silence, tap "Need a topic?" or "Help me continue" during the call.',
  'Remember: You can leave at any time with the End Conversation button.',
];

export const MatchingScreen: React.FC<MatchingScreenProps> = ({
  mode,
  regionPref,
  duration,
  fearFree,
  onMatched,
  onCancel,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 4000);

    const timer = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);

    // Auto-match after 3.5 seconds
    const matchTimer = setTimeout(() => {
      const partner = speakCircleService.findPartner(regionPref, mode, fearFree);
      onMatched(partner);
    }, 3800);

    return () => {
      clearInterval(tipInterval);
      clearInterval(timer);
      clearTimeout(matchTimer);
    };
  }, [mode, regionPref, fearFree, onMatched]);

  const regionLabel = 
    regionPref === 'any' ? 'Anywhere in India' :
    regionPref === 'diff_state' ? 'Another State' :
    regionPref === 'same_region' ? 'Same Region' : 'Same State';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-stone-900 px-4 py-8 text-white">
      {/* Top Header */}
      <div className="flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Matching Queue</span>
        </div>
        <button
          onClick={onCancel}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/80 px-3 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Center Radar & Status */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Pulsing Radar Ring */}
        <div className="relative flex h-48 w-48 items-center justify-center">
          <div className="absolute h-44 w-44 rounded-full border border-emerald-500/20 animate-ping"></div>
          <div className="absolute h-36 w-36 rounded-full border border-emerald-500/30"></div>
          <div className="absolute h-24 w-24 rounded-full bg-emerald-950/60 border border-emerald-500/50"></div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-500/30">
            <Globe className="h-8 w-8 text-white animate-spin [animation-duration:8s]" />
          </div>
        </div>

        <h2 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
          Searching for a conversation partner...
        </h2>
        
        {/* Clean Unboxed Metadata */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-stone-400">
          <span>{mode} Mode</span>
          <span aria-hidden="true">·</span>
          <span>{regionLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{duration} min</span>
        </div>

        <p className="mt-1 text-xs text-stone-400">
          Searching across active Indian learners ({elapsed}s)
        </p>
      </div>

      {/* Bottom Reassurance Card */}
      <div className="w-full max-w-md space-y-4">
        <div className="rounded-2xl border border-stone-800 bg-stone-850/80 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                Confidence Tip
              </p>
              <p className="mt-1 text-xs text-stone-300 leading-relaxed min-h-[38px] transition-all">
                "{TIPS[tipIndex]}"
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-stone-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Private 1-to-1 Room · Zero contact info shared</span>
        </div>
      </div>
    </div>
  );
};
