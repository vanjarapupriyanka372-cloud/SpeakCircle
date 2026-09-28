import React, { useState } from 'react';
import { ConversationPartner, ReportItem } from '../types';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  partner: ConversationPartner;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportItem['reason'], details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  partner,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportItem['reason']>('Asking for personal information');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const reasons: ReportItem['reason'][] = [
    'Asking for personal information',
    'Abusive language',
    'Harassment',
    'Sexual/inappropriate conversation',
    'Hate speech',
    'Threatening behavior',
    'Spam',
    'Repeated unwanted interaction',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedReason, details.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-rose-600 mb-1">
          <ShieldAlert className="h-5 w-5" />
          <h2 className="font-display text-base font-bold text-stone-900">
            Report Conversation Partner
          </h2>
        </div>

        <p className="text-xs text-stone-600 mb-4">
          Reporting <strong className="text-stone-900">{partner.displayName}</strong> will immediately block them and send this incident to our moderation queue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Reason for Report
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {reasons.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs cursor-pointer transition-all ${
                    selectedReason === r
                      ? 'border-rose-500 bg-rose-50/60 font-semibold text-rose-900'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="accent-rose-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="What specifically happened? Any details help our moderators take appropriate action."
              className="w-full rounded-xl border border-stone-300 p-2.5 text-xs text-stone-900 focus:border-rose-500 focus:outline-hidden"
              rows={3}
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[11px] text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <span>
              SpeakCircle employs human review alongside escalating moderation. Submitting a report automatically blocks this user for your protection.
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
            >
              Submit Report & Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
