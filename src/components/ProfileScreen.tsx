import React, { useState } from 'react';
import { UserProfile, BlockedUser, EnglishLevel } from '../types';
import { ALL_INDIAN_STATES, getRegionForState } from '../data/regions';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  UserX, 
  Settings, 
  HeartHandshake, 
  FileText, 
  ShieldAlert, 
  Check, 
  Clock 
} from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  blockedUsers: BlockedUser[];
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onUnblockUser: (userId: string) => void;
  onOpenSafety: () => void;
  onOpenAdmin: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  blockedUsers,
  onUpdateUser,
  onUnblockUser,
  onOpenSafety,
  onOpenAdmin,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [selectedState, setSelectedState] = useState(user.state);
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user.englishLevel);
  const [savedNotice, setSavedNotice] = useState(false);

  const levels: EnglishLevel[] = ['Beginner', 'Basic', 'Intermediate', 'Comfortable', 'Advanced'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const region = getRegionForState(selectedState);
    onUpdateUser({
      displayName: displayName.trim() || 'Learner',
      state: selectedState,
      region,
      englishLevel: selectedLevel,
    });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
          Profile & Preferences
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Manage how you appear to conversation partners while keeping your identity private.
        </p>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
          <Check className="h-4 w-4 text-emerald-700" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {/* Minimal Profile Card as specified in Section 14 */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-16 w-16 overflow-hidden rounded-full border-2 border-stone-200 bg-stone-100">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-stone-600">
                  {user.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-stone-900">
                  {user.displayName}
                </h2>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  {user.trustStatus}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                India · {user.state} ({user.region})
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                <span className="font-medium text-stone-700">English Level:</span>
                <span>{user.englishLevel}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Interests & Preferred Modes */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 space-y-2">
          <div className="text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Interested in: </span>
            {user.conversationInterests.join(' · ')}
          </div>
        </div>

        {/* Strict Privacy Reminder */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-stone-50 p-2.5 text-[11px] text-stone-500">
          <Lock className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>
            Hidden from conversation partners: Phone, email, college, exact address, socials.
          </span>
        </div>
      </div>

      {/* Profile Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Update Minimal Profile
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Display Name (First Name or Nickname)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden"
              placeholder="e.g. Priyanka or Aarav"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your State in India
            </label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-hidden"
            >
              {ALL_INDIAN_STATES.map(st => (
                <option key={st.name} value={st.name}>
                  {st.name} ({st.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              English Confidence Level
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {levels.map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    selectedLevel === lvl
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
          >
            Save Profile Changes
          </button>
        </form>
      )}

      {/* Safety & Preferences Settings */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
          Preferences & Modes
        </h3>

        {/* Fear-Free Mode Setting */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-semibold text-stone-900">Fear-Free Mode</div>
            <div className="text-[11px] text-stone-500">
              Prioritize gentle, non-stressful speaking prompts
            </div>
          </div>
          <button
            onClick={() => onUpdateUser({ fearFreeMode: !user.fearFreeMode })}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
              user.fearFreeMode ? 'bg-emerald-700' : 'bg-stone-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                user.fearFreeMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Preferred Duration */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <div>
            <div className="text-xs font-semibold text-stone-900">Preferred Duration</div>
            <div className="text-[11px] text-stone-500">
              Default time limit for conversation rooms
            </div>
          </div>
          <div className="flex items-center gap-1">
            {([5, 10, 15] as const).map(d => (
              <button
                key={d}
                onClick={() => onUpdateUser({ preferredDuration: d })}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  user.preferredDuration === d
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blocked Users Section */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserX className="h-4 w-4 text-stone-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Blocked Users
            </h3>
          </div>
          <span className="text-xs text-stone-500">{blockedUsers.length} blocked</span>
        </div>

        <p className="text-xs text-stone-500 mb-3">
          Blocked users can never match with you or interact with you on SpeakCircle.
        </p>

        {blockedUsers.length === 0 ? (
          <div className="rounded-xl bg-stone-50 p-3 text-center text-xs text-stone-500">
            No blocked users.
          </div>
        ) : (
          <div className="space-y-2">
            {blockedUsers.map(b => (
              <div
                key={b.userId}
                className="flex items-center justify-between rounded-lg border border-stone-100 bg-stone-50 p-2.5 text-xs"
              >
                <div>
                  <span className="font-semibold text-stone-900">{b.displayName}</span>
                  <span className="text-stone-500 ml-1">({b.state})</span>
                </div>
                <button
                  onClick={() => onUnblockUser(b.userId)}
                  className="rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] font-medium text-stone-700 hover:bg-stone-100"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety & Policies Links */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
          Safety Center & Legal
        </h3>

        <button
          onClick={onOpenSafety}
          className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs font-medium text-stone-700 hover:bg-stone-50"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Community Guidelines & Safety Center</span>
          </div>
          <span className="text-stone-400">→</span>
        </button>

        <button
          onClick={onOpenSafety}
          className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs font-medium text-stone-700 hover:bg-stone-50"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-stone-600" />
            <span>Privacy Policy & Terms of Service</span>
          </div>
          <span className="text-stone-400">→</span>
        </button>

        {/* Admin Portal Entry */}
        <div className="pt-2 border-t border-stone-100">
          <button
            onClick={onOpenAdmin}
            className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-700" />
              <span>Safety Moderation & Admin Console</span>
            </div>
            <span className="text-amber-700 font-semibold text-[11px]">Admin Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};
