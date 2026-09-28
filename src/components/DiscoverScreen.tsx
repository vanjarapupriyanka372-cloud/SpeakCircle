import React, { useState } from 'react';
import { IndianRegion } from '../types';
import { REGIONS_DATA, ALL_INDIAN_STATES } from '../data/regions';
import { Globe, MapPin, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';

interface DiscoverScreenProps {
  onQuickMatchRegion: (region: IndianRegion) => void;
  userState: string;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onQuickMatchRegion,
  userState,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<IndianRegion>('South India');
  const [searchQuery, setSearchQuery] = useState('');

  const regions: IndianRegion[] = [
    'South India',
    'North India',
    'West India',
    'East India',
    'Northeast India',
  ];

  const currentRegionData = REGIONS_DATA[selectedRegion];

  const filteredStates = ALL_INDIAN_STATES.filter(
    s =>
      s.region === selectedRegion &&
      (searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
          Discover India Across Accents
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Speak with learners from different states to become confident with varied communication styles.
        </p>
      </div>

      {/* Region Segmented Tabs */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {regions.map(reg => {
          const isSelected = selectedRegion === reg;
          return (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`min-h-[44px] whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {reg}
            </button>
          );
        })}
      </div>

      {/* Active Region Spotlight Card */}
      <div className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <Globe className="h-4 w-4" />
              <span>{selectedRegion}</span>
            </div>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed">
              {currentRegionData.description}
            </p>
          </div>
          <button
            onClick={() => onQuickMatchRegion(selectedRegion)}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Talk Here</span>
          </button>
        </div>

        {/* Unboxed Metadata */}
        <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3 text-[11px] text-stone-500">
          <span>{currentRegionData.states.length} States & UTs</span>
          <span aria-hidden="true">·</span>
          <span>Open to all levels</span>
          <span aria-hidden="true">·</span>
          <span>Zero pressure</span>
        </div>
      </div>

      {/* States List in this Region */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            States in {selectedRegion}
          </h2>
          <span className="text-xs text-stone-500">Your state: {userState}</span>
        </div>

        <div className="space-y-2">
          {filteredStates.map(state => {
            const isSelf = state.name.toLowerCase() === userState.toLowerCase();
            return (
              <div
                key={state.name}
                className="flex items-center justify-between rounded-xl border border-stone-200/90 bg-white p-3 shadow-xs hover:border-stone-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                    <MapPin className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-900">{state.name}</span>
                      {isSelf && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          Your State
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-stone-600">{state.vibe}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                      <span>Languages: {state.popularLanguages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onQuickMatchRegion(selectedRegion)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                  aria-label={`Practice with someone from ${state.name}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exposure Tip */}
      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-stone-600">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
          <p>
            <strong className="text-stone-900">Why accent diversity matters:</strong> In real college placements and corporate jobs in India, you will work with colleagues from Chennai, Delhi, Pune, Kolkata, and Guwahati. Practicing across regions builds real-world listening confidence!
          </p>
        </div>
      </div>
    </div>
  );
};
