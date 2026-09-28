import React, { useState, useRef, useEffect } from 'react';
import { DAILY_CHALLENGES, CONVERSATION_CARDS } from '../data/topics';
import { DailyChallenge, ConversationCard } from '../types';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Volume2,
  ChevronRight
} from 'lucide-react';

interface PracticeScreenProps {
  onStartChallengeCall: (challenge: DailyChallenge) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onStartChallengeCall }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<DailyChallenge>(DAILY_CHALLENGES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Solo 60-Second Audio Warmup State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [liveVolume, setLiveVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Categories for conversation cards
  const categories = ['All', 'Fun', 'College', 'Career', 'Technology', 'Interview', 'Debate'];

  const filteredCards = CONVERSATION_CARDS.filter(
    c => selectedCategory === 'All' || c.category === selectedCategory
  );

  // Start Solo Warmup Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        setLiveVolume(sum / dataArray.length);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasRecorded(true);
        stream.getTracks().forEach(t => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      };

      recorder.start();
      setIsRecording(true);
      setRecordedSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordedSeconds(s => {
          if (s >= 59) {
            stopRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone error or permission denied in warmup', err);
      // Simulate warmup without physical mic if blocked
      setIsRecording(true);
      setRecordedSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordedSeconds(s => {
          if (s >= 59) {
            setIsRecording(false);
            setHasRecorded(true);
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-4 pb-24 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
          Speaking Practice & Daily Challenges
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Warm up your voice solo or take on structured daily conversation challenges.
        </p>
      </div>

      {/* Solo 60-Second Vocal Warmup Studio */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Solo Vocal Warmup (60 Seconds)
              </h2>
              <p className="text-[11px] text-stone-500">
                Shake off hesitation privately before matching with a partner.
              </p>
            </div>
          </div>
          {isRecording && (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></span>
              {recordedSeconds}s / 60s
            </span>
          )}
        </div>

        {/* Prompt to read */}
        <div className="rounded-xl border border-stone-100 bg-stone-50 p-3 my-3">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">
            Warmup Prompt
          </p>
          <p className="text-xs text-stone-800 font-medium leading-relaxed">
            "Hello! My name is Priyanka. Today I am practicing English to speak naturally and without hesitation. Mistakes are part of learning."
          </p>
        </div>

        {/* Audio Wave Visualizer during recording */}
        {isRecording && (
          <div className="flex h-8 items-center justify-center gap-1 my-3 bg-stone-900 rounded-xl px-4">
            {[20, 60, 40, 90, 70, 45, 80, 50, 65, 30].map((h, i) => {
              const dynH = Math.min(100, Math.max(15, (liveVolume / 40) * h));
              return (
                <div
                  key={i}
                  style={{ height: `${dynH}%` }}
                  className="w-1 rounded-full bg-emerald-400 transition-all duration-100"
                />
              );
            })}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 pt-1">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800"
            >
              <Mic className="h-4 w-4" />
              <span>{hasRecorded ? 'Record Again' : 'Start 60s Solo Warmup'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-xs font-semibold text-white shadow-xs hover:bg-rose-800"
            >
              <MicOff className="h-4 w-4" />
              <span>Done Speaking ({recordedSeconds}s)</span>
            </button>
          )}

          {hasRecorded && audioUrl && (
            <audio controls src={audioUrl} className="h-10 max-w-[200px]" />
          )}
        </div>
      </div>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            Daily Speaking Challenges
          </h2>
          <span className="text-xs text-stone-500">Day {selectedChallenge.dayNumber} of 5</span>
        </div>

        {/* Horizontal Days Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mb-3">
          {DAILY_CHALLENGES.map(ch => {
            const isSelected = selectedChallenge.id === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span>Day {ch.dayNumber}</span>
                <span className="text-[10px] opacity-80">{ch.category}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Challenge Spotlight */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Day {selectedChallenge.dayNumber} Challenge
              </span>
              <h3 className="font-display text-base font-bold text-stone-900 mt-0.5">
                {selectedChallenge.title}
              </h3>
            </div>
            <span className="flex items-center gap-1 text-xs text-stone-500">
              <Clock className="h-3.5 w-3.5" />
              {selectedChallenge.durationHint}
            </span>
          </div>

          <p className="mt-2 text-xs text-stone-700 leading-relaxed font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">
            "{selectedChallenge.prompt}"
          </p>

          <div className="mt-3 space-y-1 text-xs text-stone-600">
            <span className="font-semibold text-stone-700">Tips for this challenge:</span>
            {selectedChallenge.sampleTips.map((tip, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                <span className="text-emerald-700">·</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onStartChallengeCall(selectedChallenge)}
            className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-all"
          >
            <span>Practice This Challenge with a Partner</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Conversation Cards Library */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-700" />
            Icebreaker Cards Library
          </h2>
          <span className="text-xs text-stone-500">{filteredCards.length} cards</span>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[36px] whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {filteredCards.map(card => (
            <div
              key={card.id}
              className="rounded-xl border border-stone-200 bg-white p-3.5 shadow-xs hover:border-stone-300 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {card.category}
              </span>
              <p className="mt-1 text-xs font-semibold text-stone-900 leading-snug">
                "{card.question}"
              </p>
              <p className="mt-2 text-[11px] text-stone-500 italic">
                Follow-up: {card.followUp}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
