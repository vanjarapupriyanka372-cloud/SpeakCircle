import React, { useState, useEffect, useRef } from 'react';
import { 
  ConversationPartner, 
  ConversationMode, 
  UserProfile 
} from '../types';
import { 
  CONVERSATION_CARDS, 
  RESCUE_QUESTIONS, 
  INTERVIEW_TOPICS, 
  RANDOM_SAFE_TOPICS, 
  CASUAL_TOPICS, 
  KNOWLEDGE_TOPICS, 
  DEBATE_TOPICS 
} from '../data/topics';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  LifeBuoy, 
  Layers, 
  ShieldAlert, 
  UserX, 
  RefreshCw, 
  ArrowLeftRight, 
  Volume2, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface VoiceRoomProps {
  user: UserProfile;
  partner: ConversationPartner;
  mode: ConversationMode;
  initialTopic: string;
  durationMinutes: number;
  fearFree: boolean;
  onEndCall: (durationSeconds: number, topicsDiscussed: string[]) => void;
  onReportPartner: () => void;
  onBlockPartner: () => void;
}

export const VoiceRoom: React.FC<VoiceRoomProps> = ({
  user,
  partner,
  mode,
  initialTopic,
  durationMinutes,
  fearFree: _fearFree,
  onEndCall,
  onReportPartner,
  onBlockPartner,
}) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isMuted, setIsMuted] = useState(false);
  const [partnerMuted, _setPartnerMuted] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(initialTopic);
  const [topicsDiscussed, setTopicsDiscussed] = useState<string[]>([initialTopic]);

  // Audio analysis refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);

  // Conversation Tools Drawers
  const [showCardsDrawer, setShowCardsDrawer] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [interviewRole, setInterviewRole] = useState<'interviewer' | 'candidate'>('candidate');
  const [showRescueAlert, setShowRescueAlert] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  // Initialize Microphone & Web Audio API
  useEffect(() => {
    let isCancelled = false;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        micStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!analyserRef.current || isMuted) {
            setMicVolume(0);
            setIsUserSpeaking(false);
            animFrameRef.current = requestAnimationFrame(checkVolume);
            return;
          }

          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(avg);
          setIsUserSpeaking(avg > 15);
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      } catch (err) {
        console.warn('Microphone access denied or not available; using simulated speech response', err);
      }
    }

    initMic();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isMuted]);

  // Handle Mute Toggle
  const toggleMute = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
    if (!isMuted) {
      setIsUserSpeaking(false);
      setMicVolume(0);
    }
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onEndCall(totalSeconds, topicsDiscussed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalSeconds, topicsDiscussed, onEndCall]);

  // Partner speaking simulation rhythm
  useEffect(() => {
    const speakingInterval = setInterval(() => {
      if (partnerMuted) {
        setIsPartnerSpeaking(false);
        return;
      }
      // Alternate partner speaking pattern
      setIsPartnerSpeaking(prev => !prev);
    }, 5500);

    return () => clearInterval(speakingInterval);
  }, [partnerMuted]);

  // Rescue button: gives safe topic immediately
  const handleRescue = () => {
    const randomRescue = RESCUE_QUESTIONS[Math.floor(Math.random() * RESCUE_QUESTIONS.length)];
    setCurrentTopic(randomRescue);
    setTopicsDiscussed(prev => Array.from(new Set([...prev, randomRescue])));
    setShowRescueAlert(true);
    setTimeout(() => setShowRescueAlert(false), 5000);
  };

  // Topic Roulette
  const handleTopicRoulette = () => {
    let pool = RANDOM_SAFE_TOPICS;
    if (mode === 'Casual') pool = CASUAL_TOPICS;
    if (mode === 'Knowledge') pool = KNOWLEDGE_TOPICS;
    if (mode === 'Debate') pool = DEBATE_TOPICS;

    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentTopic(next);
    setTopicsDiscussed(prev => Array.from(new Set([...prev, next])));
  };

  // Interview Role Switch
  const handleToggleRole = () => {
    setInterviewRole(prev => (prev === 'candidate' ? 'interviewer' : 'candidate'));
    const nextQ = INTERVIEW_TOPICS[Math.floor(Math.random() * INTERVIEW_TOPICS.length)].question;
    setCurrentTopic(nextQ);
    setTopicsDiscussed(prev => Array.from(new Set([...prev, nextQ])));
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentCard = CONVERSATION_CARDS[activeCardIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-900 text-stone-100 pb-[env(safe-area-inset-bottom)]">
      {/* Top Bar: Room Info & Safety actions */}
      <div className="flex h-14 items-center justify-between border-b border-stone-800 bg-stone-950/80 px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {mode} Practice Room
          </span>
        </div>

        {/* Live Timer Countdown */}
        <div className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs font-medium text-stone-200">
          <span className="text-stone-400">Remaining:</span>
          <span className="font-mono text-emerald-400 font-bold tabular-nums">
            {formatTime(secondsRemaining)}
          </span>
        </div>

        {/* Safety Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSafetyNotice('Reminder: Never share phone, email, or passwords.');
              setTimeout(() => setSafetyNotice(null), 4000);
            }}
            className="flex h-8 items-center gap-1 rounded-md border border-stone-800 bg-stone-900 px-2 text-[11px] text-stone-400 hover:text-white"
            title="Privacy Guard"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Protected</span>
          </button>
          <button
            onClick={onReportPartner}
            className="flex h-8 items-center gap-1 rounded-md border border-stone-800 bg-stone-900 px-2 text-[11px] text-stone-400 hover:text-rose-400"
            title="Report this user"
          >
            <span>Report</span>
          </button>
          <button
            onClick={onBlockPartner}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200"
            title="Block user"
          >
            <UserX className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Notice Toast */}
      {safetyNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 px-4 py-2 text-center text-xs text-emerald-300">
          {safetyNotice}
        </div>
      )}

      {/* Rescue Alert Toast */}
      {showRescueAlert && (
        <div className="bg-amber-950/90 border-b border-amber-800 px-4 py-2 text-center text-xs text-amber-200">
          Conversation rescued! Fresh question sent to both screens below.
        </div>
      )}

      {/* Main Conversation Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-5 max-w-lg mx-auto w-full flex flex-col justify-between">
        {/* 1-to-1 Voice Avatars & Audio Waves */}
        <div className="grid grid-cols-2 gap-4">
          {/* Partner Card */}
          <div className="relative flex flex-col items-center rounded-2xl border border-stone-800 bg-stone-850/80 p-4 text-center backdrop-blur-sm">
            <div className="relative mb-2">
              <div
                className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 transition-all ${
                  isPartnerSpeaking
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-stone-700'
                }`}
              >
                {partner.avatarUrl ? (
                  <img
                    src={partner.avatarUrl}
                    alt={partner.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-stone-800 flex items-center justify-center text-xl font-bold text-stone-300">
                    {partner.displayName.charAt(0)}
                  </div>
                )}
              </div>
              {/* Partner Speaking Indicator */}
              {isPartnerSpeaking && (
                <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  <Volume2 className="h-2.5 w-2.5" />
                </span>
              )}
            </div>

            <h3 className="font-display text-sm font-bold text-white">{partner.displayName}</h3>
            
            {/* Unboxed metadata */}
            <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <span>{partner.state}</span>
              <span aria-hidden="true">·</span>
              <span>{partner.englishLevel}</span>
            </div>

            <div className="mt-2 text-[10px] text-emerald-400 font-medium">
              {partner.trustStatus}
            </div>

            {/* Audio Wave Bars */}
            <div className="mt-3 flex h-4 items-center gap-1">
              {[40, 75, 50, 90, 60].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isPartnerSpeaking ? `${h}%` : '20%' }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPartnerSpeaking ? 'bg-emerald-400' : 'bg-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* You (Self) Card */}
          <div className="relative flex flex-col items-center rounded-2xl border border-stone-800 bg-stone-850/80 p-4 text-center backdrop-blur-sm">
            <div className="relative mb-2">
              <div
                className={`relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 transition-all ${
                  isUserSpeaking && !isMuted
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-stone-700'
                }`}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-stone-800 flex items-center justify-center text-xl font-bold text-stone-300">
                    {user.displayName.charAt(0)}
                  </div>
                )}
              </div>
              {isMuted && (
                <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white">
                  <MicOff className="h-2.5 w-2.5" />
                </span>
              )}
            </div>

            <h3 className="font-display text-sm font-bold text-white">
              {user.displayName} <span className="text-stone-400 font-normal">(You)</span>
            </h3>

            {/* Unboxed metadata */}
            <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <span>{user.state}</span>
              <span aria-hidden="true">·</span>
              <span>{user.englishLevel}</span>
            </div>

            <div className="mt-2 text-[10px] text-stone-400 font-medium">
              {isMuted ? 'Microphone Muted' : isUserSpeaking ? 'Speaking...' : 'Listening...'}
            </div>

            {/* Real Audio Volume Wave Bars */}
            <div className="mt-3 flex h-4 items-center gap-1">
              {[30, 80, 50, 100, 60].map((h, i) => {
                const dynamicH = isMuted ? 20 : isUserSpeaking ? Math.min(100, Math.max(25, (micVolume / 60) * h)) : 20;
                return (
                  <div
                    key={i}
                    style={{ height: `${dynamicH}%` }}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      !isMuted && isUserSpeaking ? 'bg-emerald-400' : 'bg-stone-700'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Active Topic Card */}
        <div className="my-4 rounded-2xl border border-stone-800 bg-stone-850 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Active Speaking Prompt
            </span>

            {mode === 'Interview' && (
              <button
                onClick={handleToggleRole}
                className="flex items-center gap-1 rounded-md border border-stone-700 bg-stone-800 px-2 py-1 text-[11px] text-stone-300 hover:text-white"
              >
                <ArrowLeftRight className="h-3 w-3" />
                <span>Role: {interviewRole}</span>
              </button>
            )}
          </div>

          <p className="font-display text-base font-medium text-white leading-relaxed">
            "{currentTopic}"
          </p>

          {/* Quick Prompts Tools */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
            <button
              onClick={handleTopicRoulette}
              className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-1.5 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Spin Safe Topic</span>
            </button>

            <button
              onClick={() => setShowCardsDrawer(!showCardsDrawer)}
              className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-1.5 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Question Cards</span>
            </button>

            <button
              onClick={handleRescue}
              className="flex items-center gap-1.5 rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-900/60"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Help Me Continue</span>
            </button>
          </div>
        </div>

        {/* Conversation Cards Drawer (If open) */}
        {showCardsDrawer && (
          <div className="mb-4 rounded-2xl border border-stone-700 bg-stone-800/90 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Category: {currentCard.category}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setActiveCardIndex(prev =>
                      prev === 0 ? CONVERSATION_CARDS.length - 1 : prev - 1
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-700 text-stone-300 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-stone-400 px-1">
                  {activeCardIndex + 1}/{CONVERSATION_CARDS.length}
                </span>
                <button
                  onClick={() =>
                    setActiveCardIndex(prev => (prev + 1) % CONVERSATION_CARDS.length)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-700 text-stone-300 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-white mb-2">"{currentCard.question}"</p>
            <p className="text-xs text-stone-400 italic">Follow-up: {currentCard.followUp}</p>

            <button
              onClick={() => {
                setCurrentTopic(currentCard.question);
                setTopicsDiscussed(prev => Array.from(new Set([...prev, currentCard.question])));
                setShowCardsDrawer(false);
              }}
              className="mt-3 w-full rounded-lg bg-emerald-700 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Use This Question
            </button>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar: Mute & No-Pressure End Conversation */}
      <div className="border-t border-stone-800 bg-stone-950 px-4 py-4">
        <div className="mx-auto flex max-w-sm items-center justify-between gap-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border font-medium text-sm transition-all ${
              isMuted
                ? 'border-rose-800 bg-rose-950/60 text-rose-300 hover:bg-rose-900/60'
                : 'border-stone-700 bg-stone-850 text-stone-200 hover:bg-stone-800'
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-emerald-400" />}
            <span>{isMuted ? 'Unmute' : 'Mute Mic'}</span>
          </button>

          {/* No-Pressure Exit Button */}
          <button
            onClick={() => onEndCall(totalSeconds - secondsRemaining, topicsDiscussed)}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 font-medium text-sm text-white shadow-lg shadow-rose-950/40 hover:bg-rose-800 active:scale-[0.98] transition-all"
          >
            <PhoneOff className="h-5 w-5" />
            <span>End Call</span>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-stone-400">
          No explanation needed to leave. You control your time.
        </p>
      </div>
    </div>
  );
};
