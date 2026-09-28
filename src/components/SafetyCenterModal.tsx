import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  AlertTriangle, 
  UserCheck, 
  HeartHandshake, 
  FileCheck2 
} from 'lucide-react';

interface SafetyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyCenterModal: React.FC<SafetyCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-emerald-800 mb-2">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="font-display text-lg font-bold text-stone-900">
            Safety Center & Community Guidelines
          </h2>
        </div>

        <p className="text-xs text-stone-600 mb-5">
          SpeakCircle was designed from the ground up to be India's safest environment for spoken English practice.
        </p>

        <div className="space-y-4">
          {/* Pillar 1: Zero Personal Data */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
              <Lock className="h-4 w-4 text-emerald-700" />
              <span>Strict Privacy by Design</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never expose or request phone numbers, email addresses, exact residential locations, college or company names, or social media accounts. Conversation partners only see your first name/nickname, state, and self-assessed English level.
            </p>
          </div>

          {/* Pillar 2: 18+ Age Policy */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-700" />
              <span>18+ Age Policy & Verification</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              SpeakCircle is strictly intended for learners aged 18 and older. Anonymous minors or age bypasses are not permitted. This ensures comfortable peer-to-peer discussions on college, career, and adult life.
            </p>
          </div>

          {/* Pillar 3: Escalating Moderation */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <span>Escalating Moderation Framework</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              We do not ban users on an unverified single glitch. Instead, our human-moderated trust system uses calibrated escalation:
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[10px] font-medium text-stone-700">
              <div className="rounded bg-stone-200 p-1.5">1. Formal Warning</div>
              <div className="rounded bg-amber-100 p-1.5 text-amber-800">2. 24h Restriction</div>
              <div className="rounded bg-orange-100 p-1.5 text-orange-800">3. Suspension</div>
              <div className="rounded bg-rose-100 p-1.5 text-rose-800">4. Permanent Ban</div>
            </div>
          </div>

          {/* Pillar 4: Non-Judgmental Practice */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
              <HeartHandshake className="h-4 w-4 text-emerald-700" />
              <span>Non-Judgmental Practice Pledge</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Grammar shaming or mocking regional accents is strictly prohibited. Everyone on SpeakCircle is practicing to build confidence. Mistakes and pauses are completely natural and respected.
            </p>
          </div>

          {/* Pillar 5: No-Pressure Exit */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-stone-900 mb-1">
              <FileCheck2 className="h-4 w-4 text-stone-700" />
              <span>No-Pressure Exit Guarantee</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              You are never forced to stay in any conversation. A red "End Call" button is always visible. Tapping it exits the room immediately without explanation or penalty.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-all"
        >
          I Understand & Agree to Community Guidelines
        </button>
      </div>
    </div>
  );
};
