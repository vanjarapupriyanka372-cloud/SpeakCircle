import React from 'react';
import { UserProfile, ConversationFeedback } from '../types';
import { ALL_INDIAN_STATES } from '../data/regions';
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  Flame, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Smile, 
  MessageSquare 
} from 'lucide-react';

interface ProgressScreenProps {
  user: UserProfile;
  feedbackHistory: ConversationFeedback[];
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ user, feedbackHistory }) => {
  const totalStatesInIndia = ALL_INDIAN_STATES.length;
  const statesUnlockedCount = user.statesSpokenWith.length;
  const statesPercentage = Math.round((statesUnlockedCount / totalStatesInIndia) * 100);

  return (
    <div className="mx-auto max-w-xl px-4 py-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
          My Confidence Progress
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Tracking your spoken communication growth and regional connections without judgment.
        </p>
      </div>

      {/* Trust & Reputation Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Community Standing
                </span>
              </div>
              <h2 className="font-display text-base font-bold text-stone-900">
                {user.trustStatus}
              </h2>
              <p className="text-[11px] text-stone-500">
                Earned through respectful conversations and zero safety reports.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Good Standing
          </span>
        </div>
      </div>

      {/* Big Numbers Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Metric 1 */}
        <div className="rounded-xl border border-stone-200 bg-white p-3 text-center shadow-xs">
          <div className="flex items-center justify-center text-emerald-700 mb-1">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {user.completedConversations}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">Conversations</div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-stone-200 bg-white p-3 text-center shadow-xs">
          <div className="flex items-center justify-center text-emerald-700 mb-1">
            <Clock className="h-4 w-4" />
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {user.totalSpeakingMinutes}m
          </div>
          <div className="text-[11px] text-stone-500 font-medium">Minutes Spoken</div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-stone-200 bg-white p-3 text-center shadow-xs">
          <div className="flex items-center justify-center text-amber-600 mb-1">
            <Flame className="h-4 w-4" />
          </div>
          <div className="font-display text-2xl font-bold text-stone-900 tabular-nums">
            {user.streakDays}
          </div>
          <div className="text-[11px] text-stone-500 font-medium">Day Streak</div>
        </div>
      </div>

      {/* Pan-India Accent Exposure Tracker */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-semibold text-stone-900">
              Pan-India Spoken Exposure
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800">
            {statesUnlockedCount} / {totalStatesInIndia} States
          </span>
        </div>

        <p className="text-xs text-stone-600 mb-3">
          You've conversed with peers from {statesUnlockedCount} different states so far. Practicing with diverse regions trains your ear to understand all Indian English accents.
        </p>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden mb-4">
          <div
            style={{ width: `${Math.max(10, statesPercentage)}%` }}
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
          />
        </div>

        {/* Unlocked States Tags */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            States You Have Practiced With:
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.statesSpokenWith.map(st => (
              <span
                key={st}
                className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                {st}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Encouragement Milestones */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-emerald-700" />
          Milestones Achieved
        </h2>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
            <div className="font-semibold text-stone-900">First Conversation</div>
            <p className="text-[11px] text-stone-500 mt-0.5">Broke the fear barrier</p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
            <div className="font-semibold text-stone-900">Interstate Talker</div>
            <p className="text-[11px] text-stone-500 mt-0.5">Spoke across state lines</p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
            <div className="font-semibold text-stone-900">3-Day Streak</div>
            <p className="text-[11px] text-stone-500 mt-0.5">Consistent daily practice</p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-2.5">
            <div className="font-semibold text-stone-900">Interview Warmup</div>
            <p className="text-[11px] text-stone-500 mt-0.5">Practiced mock Q&A</p>
          </div>
        </div>
      </div>

      {/* Recent Conversation Feedback Log */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2.5">
          Recent Private Feedback Notes
        </h2>

        <div className="space-y-2.5">
          {feedbackHistory.map(fb => (
            <div
              key={fb.id}
              className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-stone-900">
                    {fb.mode} Practice
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500">{fb.partnerRegion}</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {fb.feeling}
                </span>
              </div>

              <div className="space-y-1 text-xs text-stone-600 mt-2">
                {fb.practiceSuggestions.map((sug, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{sug}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
