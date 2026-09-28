import React, { useState } from 'react';
import { UserProfile, EnglishLevel } from '../types';
import { ALL_INDIAN_STATES, getRegionForState } from '../data/regions';
import { ShieldCheck, User, MapPin, Check, HeartHandshake } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [displayName, setDisplayName] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>('Intermediate');
  const [interests, setInterests] = useState<string[]>(['Technology', 'College Life', 'Movies']);
  const [preferredDuration, setPreferredDuration] = useState<5 | 10 | 15>(10);
  const [is18Plus, setIs18Plus] = useState(false);
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [fearFree, setFearFree] = useState(false);

  if (!isOpen) return null;

  const levels: EnglishLevel[] = ['Beginner', 'Basic', 'Intermediate', 'Comfortable', 'Advanced'];
  const interestOptions = ['Technology', 'College Life', 'Movies', 'Career', 'Travel', 'Daily Life', 'Science', 'Food'];

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!is18Plus || !agreedGuidelines) return;

    const region = getRegionForState(state);
    onComplete({
      displayName: displayName.trim() || 'Learner',
      ageConfirmed: true,
      state,
      region,
      englishLevel,
      conversationInterests: interests,
      preferredDuration,
      fearFreeMode: fearFree,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white font-display text-xl font-bold">
            S
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-stone-900">
            Welcome to SpeakCircle
          </h2>
          <p className="mt-1 text-xs text-stone-600">
            "Speak without fear. Practice without judgment."
          </p>
        </div>

        {/* Strict Privacy Callout */}
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-900">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Privacy Notice:</p>
              <p className="mt-0.5 text-stone-700 leading-relaxed">
                Your personal phone number, email address, college, and exact location are <strong className="text-emerald-950">never collected or visible</strong> to conversation partners.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              1. Choose a Display Name or First Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Aarav, Priyanka, Rohit, Kavya"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden"
              />
              <User className="absolute right-3.5 top-3 h-4 w-4 text-stone-400" />
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              Only this display name will be seen by your conversation partner.
            </p>
          </div>

          {/* State in India */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              2. Your State in India *
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden"
              >
                {ALL_INDIAN_STATES.map(st => (
                  <option key={st.name} value={st.name}>
                    {st.name} ({st.region})
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-3.5 top-3 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              Used for broad regional matching and discovering different accents.
            </p>
          </div>

          {/* English Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              3. Self-Assessed Spoken English Level *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {levels.map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setEnglishLevel(lvl)}
                  className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                    englishLevel === lvl
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-600'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-stone-500">
              No judgment. This is only used to match you with compatible partners.
            </p>
          </div>

          {/* Preferred Duration */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              4. Preferred Conversation Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 15] as const).map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setPreferredDuration(d)}
                  className={`rounded-xl border py-2 text-xs font-semibold ${
                    preferredDuration === d
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {d} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Interests */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              5. Topics You Enjoy Talking About
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map(item => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fear-Free Mode Check */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fearFree}
                onChange={e => setFearFree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-emerald-700"
              />
              <div>
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1">
                  <HeartHandshake className="h-3.5 w-3.5 text-emerald-700" />
                  Enable Fear-Free Mode
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Check this if you feel extra nervous speaking to strangers. We will give you shorter calls and ultra-easy prompts.
                </p>
              </div>
            </label>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={is18Plus}
                onChange={e => setIs18Plus(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-emerald-700"
              />
              <span className="text-xs text-stone-700">
                I confirm that I am <strong className="text-stone-900">18 years of age or older</strong> and eligible for peer conversation.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedGuidelines}
                onChange={e => setAgreedGuidelines(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-emerald-700"
              />
              <span className="text-xs text-stone-700">
                I agree to the <strong className="text-stone-900">Community Guidelines</strong>: respectful English practice, zero harassment, no solicitations of personal contact info.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!is18Plus || !agreedGuidelines || !displayName.trim()}
            className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            Enter SpeakCircle & Start Practicing
          </button>
        </form>
      </div>
    </div>
  );
};
