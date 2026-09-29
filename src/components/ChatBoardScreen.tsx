import React, { useState, useEffect, useRef } from 'react';
import { n8nChatService, ChatMessage, N8N_WEBHOOK_URL } from '../services/n8nChat';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ChatBoardScreenProps {
  onOpenVoiceRoom?: () => void;
}

const QUICK_PROMPTS = [
  "Mock Job Interview: Ask me 'Tell me about yourself'",
  "Give me a 60-second topic to speak about",
  "How can I stop translating from my mother tongue in my head?",
  "Check my sentence: 'I am looking forward to meet you'",
  "What are 5 confident phrases for workplace meetings?",
];

export const ChatBoardScreen: React.FC<ChatBoardScreenProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(n8nChatService.getMessages());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<unknown>(null);

  // Sync with store
  useEffect(() => {
    const unsub = n8nChatService.subscribe(() => {
      setMessages(n8nChatService.getMessages());
    });
    return () => unsub();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      try {
        const recognition = new (SpeechRecognition as new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
          stop: () => void;
        })();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English recognition

        recognition.onresult = (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
          const transcript = e.results[0][0].transcript;
          if (transcript) {
            setInputValue(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsDictating(false);
        };

        recognition.onerror = () => setIsDictating(false);
        recognition.onend = () => setIsDictating(false);
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition init error', e);
      }
    }
  }, []);

  // Handle Speech-to-Text Toggle
  const toggleDictation = () => {
    if (!recognitionRef.current) return;
    const rec = recognitionRef.current as { start: () => void; stop: () => void };
    if (isDictating) {
      rec.stop();
      setIsDictating(false);
    } else {
      try {
        rec.start();
        setIsDictating(true);
      } catch {
        setIsDictating(false);
      }
    }
  };

  // Text to Speech Pronunciation
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Clear slightly relaxed pace
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msg = (textToSend || inputValue).trim();
    if (!msg || isLoading) return;

    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await n8nChatService.sendMessage(msg);
      if (autoSpeak && reply) {
        speakText(reply);
      }
    } catch {
      // Error handled by service
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetSession = () => {
    if (window.confirm('Start a fresh English practice session on the Chat Board?')) {
      n8nChatService.resetSession();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-2xl flex-col bg-stone-50 pb-[max(4.5rem,env(safe-area-inset-bottom))]">
      {/* Chat Board Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200/90 bg-white/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-sm font-bold text-stone-900">
                English Chat Board
              </h1>
              <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
                Nathan AI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <span>n8n Powered Coach</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Online</span>
            </p>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-all ${
              autoSpeak
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title={autoSpeak ? 'Auto-speak responses is ON' : 'Turn on audio voice reading'}
          >
            {autoSpeak ? <Volume2 className="h-3.5 w-3.5 text-emerald-700" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Audio On' : 'Voice'}</span>
          </button>

          <button
            onClick={handleResetSession}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            title="Start fresh conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Reassurance Banner */}
      <div className="flex items-center justify-between border-b border-stone-100 bg-emerald-50/60 px-4 py-1.5 text-[11px] text-emerald-900">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>Ask questions, practice job interview answers, or get gentle grammar feedback.</span>
        </div>
        <a
          href={N8N_WEBHOOK_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-700 hover:underline"
        >
          <span>Webhook Live</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  N
                </div>
              )}

              <div className={`max-w-[85%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-xs'
                      : 'border border-stone-200/90 bg-white text-stone-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Message Actions */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  {!isUser && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-emerald-700 flex items-center gap-0.5"
                        title="Pronounce this response"
                      >
                        <Volume2 className="h-3 w-3" />
                        <span>Listen</span>
                      </button>

                      <span aria-hidden="true">·</span>
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="hover:text-stone-700 flex items-center gap-0.5"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              N
            </div>
            <div className="rounded-2xl rounded-tl-xs border border-stone-200 bg-white px-4 py-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-stone-400">
                  Nathan is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="shrink-0 border-t border-stone-200/80 bg-white/70 px-4 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> Ideas:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900 transition-all disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="shrink-0 border-t border-stone-200 bg-white p-3">
        <div className="relative flex items-center gap-2">
          {/* Speech-to-Text Button if supported */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleDictation}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
                isDictating
                  ? 'border-rose-400 bg-rose-50 text-rose-600 animate-pulse'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
              title={isDictating ? 'Listening... click to stop' : 'Speak your question (Voice input)'}
            >
              {isDictating ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
          )}

          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isDictating
                ? 'Listening to your speech...'
                : 'Type an English question, interview answer, or prompt...'
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 max-h-28 min-h-[42px] resize-none rounded-xl border border-stone-300 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            title="Send Message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-center text-[10px] text-stone-400">
          Press Enter to send · Shift+Enter for new line · Connected to n8n webhook
        </p>
      </div>
    </div>
  );
};
