import React, { useState } from 'react';
import { ConversationPartner, ConversationMode, ConversationFeedback } from '../types';
import { 
  Smile, 
  ThumbsUp, 
  HelpCircle, 
  AlertTriangle, 
  Star, 
  Clock, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  ShieldAlert 
} from 'lucide-react';

interface PostConversationFeedbackProps {
  partner: ConversationPartner;
  mode: ConversationMode;
  durationSeconds: number;
  topicsDiscussed: string[];
  onSubmitFeedback: (feedback: ConversationFeedback) => void;
  onTalkAgain: () => void;
  onReturnHome: () => void;
  onReportPartner: () => void;
}

export const PostConversationFeedback: React.FC<PostConversationFeedbackProps> = ({
  partner,
  mode,
  durationSeconds,
  topicsDiscussed,
  onSubmitFeedback,
  onTalkAgain,
  onReturnHome,
  onReportPartner,
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<
    'Comfortable' | 'Helpful' | 'Difficult' | 'Uncomfortable'
  >('Comfortable');
  const [rating, setRating] = useState<number>(5);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

  const feelingOptions = [
    { id: 'Comfortable' as const, label: 'Comfortable', icon: Smile, desc: 'Felt relaxed & natural' },
    { id: 'Helpful' as const, label: 'Helpful', icon: ThumbsUp, desc: 'Learned something new' },
    { id: 'Difficult' as const, label: 'Difficult', icon: HelpCircle, desc: 'Felt hesitant or stuck' },
    { id: 'Uncomfortable' as const, label: 'Uncomfortable', icon: AlertTriangle, desc: 'Did not feel at ease' },
  ];

  // Uplifting practice suggestions tailored without shaming
  const generateSuggestions = () => {
    const list = [
      'Focus on speaking continuously instead of pausing for perfect grammar.',
      'Try expanding your answers with a short personal example or "because..." clause.',
      'Remember that native speakers also pause and use fillers like "Well..." or "You see...".',
    ];
    if (selectedFeeling === 'Difficult') {
      list.unshift('Take pride in completing this call! Every conversation trains your vocal confidence.');
    } else {
      list.unshift('Great conversational flow today! You kept the dialogue moving forward.');
    }
    return list;
  };

  const handleSubmit = () => {
    const feedbackObj: ConversationFeedback = {
      id: `fb-${Date.now()}`,
      conversationId: `conv-${Date.now()}`,
      partnerName: partner.displayName,
      partnerRegion: partner.state,
      mode,
      durationSeconds,
      feeling: selectedFeeling,
      rating,
      practiceSuggestions: generateSuggestions(),
      topicsDiscussed: topicsDiscussed.length > 0 ? topicsDiscussed : ['General Spoken Practice'],
      timestamp: new Date().toISOString(),
    };
    onSubmitFeedback(feedbackObj);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-20">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
        {/* Header */}
        <div className="border-b border-stone-100 bg-stone-50/80 p-5 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Award className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-stone-900">
            Call Completed
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {durationMinutes} min practiced
            </span>
            <span aria-hidden="true">·</span>
            <span>Partner: {partner.displayName} ({partner.state})</span>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {!submitted ? (
            <>
              {/* Question: How was your conversation? */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2.5">
                  How was your conversation?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {feelingOptions.map(opt => {
                    const Icon = opt.icon;
                    const isSelected = selectedFeeling === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedFeeling(opt.id)}
                        className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            className={`h-4 w-4 ${
                              isSelected ? 'text-emerald-700' : 'text-stone-500'
                            }`}
                          />
                          <span className="text-xs font-semibold text-stone-900">{opt.label}</span>
                        </div>
                        <span className="text-[11px] text-stone-600">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Private rating */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Self-Confidence Rating for this call
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-stone-300 hover:text-amber-400 focus:outline-hidden transition-colors"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-stone-100 text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-medium text-stone-600">
                    {rating === 5
                      ? 'Spoke freely!'
                      : rating >= 4
                      ? 'Felt comfortable'
                      : rating >= 3
                      ? 'Steady effort'
                      : 'Nervous start'}
                  </span>
                </div>
              </div>

              {/* Privacy disclaimer */}
              <p className="text-[11px] text-stone-600 italic">
                * Your feedback is private to your personal progress dashboard and is never shared with the other person.
              </p>

              {/* Submit Feedback CTA */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 active:scale-[0.99] transition-all"
              >
                Save & View English Suggestions
              </button>

              {/* Report option if feeling was uncomfortable */}
              {selectedFeeling === 'Uncomfortable' && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={onReportPartner}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Report partner for guideline violation</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Positive English Feedback screen */}
              <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                  Confidence & Practice Suggestions
                </h3>
                <ul className="space-y-2 text-xs text-stone-700">
                  {generateSuggestions().map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Topics Discussed */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Topics Discussed
                </h4>
                <div className="space-y-1 text-xs text-stone-600">
                  {topicsDiscussed.map((t, idx) => (
                    <div key={idx} className="rounded-lg bg-stone-100 p-2">
                      "{t}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={onTalkAgain}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Practice with Someone Else</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onReturnHome}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-all"
                >
                  <Home className="h-4 w-4" />
                  <span>Return to Home</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
