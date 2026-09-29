import React from 'react';
import { 
  ConversationMode, 
  RegionPreference, 
  UserProfile 
} from '../types';
import { 
  Coffee, 
  Briefcase, 
  Compass, 
  Flame, 
  Shuffle, 
  ShieldCheck, 
  Clock, 
  HeartHandshake, 
  Globe,
  Bot,
  ArrowRight
} from 'lucide-react';
import heroImage from '../assets/images/hero_speakcircle_banner_1790583242753.jpg';

interface HomeScreenProps {
  user: UserProfile;
  selectedMode: ConversationMode;
  onSelectMode: (mode: ConversationMode) => void;
  selectedRegionPref: RegionPreference;
  onSelectRegionPref: (pref: RegionPreference) => void;
  duration: 5 | 10 | 15;
  onSelectDuration: (dur: 5 | 10 | 15) => void;
  fearFree: boolean;
  onToggleFearFree: () => void;
  onStartMatching: () => void;
  onOpenSafety: () => void;
  onOpenChatBoard: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  selectedMode,
  onSelectMode,
  selectedRegionPref,
  onSelectRegionPref,
  duration,
  onSelectDuration,
  fearFree,
  onToggleFearFree,
  onStartMatching,
  onOpenSafety,
  onOpenChatBoard,
}) => {
  const modes: { id: ConversationMode; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'Casual',
      label: 'Casual Chat',
      desc: 'Movies, hobbies, college life & local street food',
      icon: Coffee,
    },
    {
      id: 'Interview',
      label: 'Interview Practice',
      desc: 'Placements, self-intro & STAR project questions',
      icon: Briefcase,
    },
    {
      id: 'Knowledge',
      label: 'Knowledge & Tech',
      desc: 'AI, science, education & current affairs',
      icon: Compass,
    },
    {
      id: 'Debate',
      label: 'Friendly Debate',
      desc: 'Neutral perspectives on college & career topics',
      icon: Flame,
    },
    {
      id: 'Random',
      label: 'Random Safe Topic',
      desc: 'Surprise question to overcome awkward silence',
      icon: Shuffle,
    },
  ];

  const regionOptions: { id: RegionPreference; label: string; subtext: string }[] = [
    { id: 'any', label: 'Anywhere in India', subtext: 'Fastest match with any active learner' },
    { id: 'diff_state', label: 'Another State', subtext: 'Discover different regional English accents' },
    { id: 'same_region', label: 'Same Region', subtext: `Connect across ${user.region}` },
    { id: 'same_state', label: 'My State', subtext: `Learners in ${user.state}` },
  ];

  return (
    <div className="mx-auto max-w-xl pb-24 pt-3 px-4">
      {/* Hero Welcome Banner */}
      <div className="relative mb-5 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
        <div className="relative h-44 w-full overflow-hidden bg-stone-100">
          <img
            src={heroImage}
            alt="Two young Indian students conversing calmly on a campus bench"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h1 className="font-display text-xl font-bold tracking-tight text-white drop-shadow-sm">
              Speak without fear. Practice without judgment.
            </h1>
            <p className="mt-0.5 text-xs text-stone-200">
              Private 1-to-1 spoken English with friendly peers across India
            </p>
          </div>
        </div>

        {/* Live Community Proof */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/70 px-4 py-2.5 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            </span>
            <span>142 learners available in queue right now</span>
          </div>
          <div className="text-stone-500">
            <span>You: {user.displayName}</span>
            <span aria-hidden="true" className="mx-1">·</span>
            <span>{user.state}</span>
          </div>
        </div>
      </div>

      {/* Fear-Free Mode Banner Toggle */}
      <div
        onClick={onToggleFearFree}
        className={`mb-5 cursor-pointer rounded-2xl border p-3.5 transition-all ${
          fearFree
            ? 'border-emerald-300 bg-emerald-50/90 shadow-xs'
            : 'border-stone-200 bg-white hover:border-stone-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                fearFree ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-stone-900">Fear-Free Mode</span>
                {fearFree && (
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600">
                {fearFree
                  ? 'Shorter calls, ultra-simple prompts, no pressure on pauses'
                  : 'Feeling nervous speaking to strangers? Turn this on for gentle prompts'}
              </p>
            </div>
          </div>
          <div
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              fearFree ? 'bg-emerald-700' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                fearFree ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* AI English Chat Board Spotlight Card */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-stone-50 p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-stone-900">
                  AI English Chat Board
                </h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  n8n Live
                </span>
              </div>
              <p className="mt-0.5 text-xs text-stone-600 leading-relaxed">
                Practice 1-on-1 with Nathan, your AI English Coach. Ask interview questions, vocabulary guidance, or pronounce phrases with voice output.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-emerald-100/60 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            <span>Always available · Zero judgment</span>
          </div>
          <button
            onClick={onOpenChatBoard}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 active:scale-95 transition-all"
          >
            <span>Open Chat Board</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Step 1: Conversation Mode */}
      <div className="mb-5">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            1. Choose Conversation Type
          </h2>
          <span className="text-xs text-stone-500">Selected: {selectedMode}</span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {modes.map(m => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-stone-900">{m.label}</div>
                  <div className="line-clamp-1 text-xs text-stone-600">{m.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Region Preference */}
      <div className="mb-5">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            2. Match Preference
          </h2>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Globe className="h-3 w-3" /> Broad Regions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {regionOptions.map(opt => {
            const isSelected = selectedRegionPref === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectRegionPref(opt.id)}
                className={`flex flex-col rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-xs font-semibold text-stone-900">{opt.label}</span>
                <span className="mt-0.5 line-clamp-1 text-[11px] text-stone-600">{opt.subtext}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Duration Selection */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            3. Call Duration
          </h2>
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Auto-end when time expires
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {([5, 10, 15] as const).map(d => {
            const isSelected = duration === d;
            return (
              <button
                key={d}
                onClick={() => onSelectDuration(d)}
                className={`flex flex-col items-center justify-center rounded-xl border py-2.5 transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="font-display text-base font-bold text-stone-900">{d} min</span>
                <span className="text-[10px] text-stone-600">
                  {d === 5 ? 'Icebreaker' : d === 10 ? 'Standard' : 'Full Session'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mb-5">
        <button
          onClick={onStartMatching}
          className="group relative flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 font-display text-base font-semibold text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-emerald-800 active:scale-[0.99]"
        >
          <span>I'm Ready to Talk</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-2 text-center text-xs text-stone-500">
          Finds an available 1-to-1 conversation partner. Cancel anytime.
        </p>
      </div>

      {/* Strict Privacy Card */}
      <div className="rounded-xl border border-stone-200/90 bg-stone-50 p-3.5 text-xs text-stone-600">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Your Privacy is Protected</p>
            <p className="leading-relaxed">
              Phone numbers, email addresses, exact location, and college/company names are{' '}
              <strong className="text-stone-900 font-semibold">never visible</strong> to conversation partners. Only your display name, broad region, and practice level are shown.
            </p>
            <button
              onClick={onOpenSafety}
              className="text-emerald-700 font-medium underline underline-offset-2 hover:text-emerald-800"
            >
              Read Community Guidelines & Safety Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
