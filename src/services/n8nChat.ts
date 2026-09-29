export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const STORAGE_KEY_CHAT_HISTORY = 'speakcircle_n8n_chat_history_v1';
const STORAGE_KEY_SESSION_ID = 'speakcircle_n8n_session_id_v1';

export const N8N_WEBHOOK_URL = 'https://leona25.app.n8n.cloud/webhook/eb257578-f242-4528-a66b-94f5c97b4b09/chat';

export class N8nChatService {
  private sessionId: string;
  private messages: ChatMessage[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.messages = this.loadHistory();
  }

  private getOrCreateSessionId(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION_ID);
      if (stored) return stored;
      const newId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(STORAGE_KEY_SESSION_ID, newId);
      return newId;
    } catch {
      return `session-${Date.now()}`;
    }
  }

  private loadHistory(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHAT_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial greeting from Nathan
    return [
      {
        id: 'msg-init-1',
        role: 'assistant',
        text: "Hi there! 👋 I am Nathan, your English Practice Coach on SpeakCircle.\n\nHow can I assist you today? You can practice a job interview, ask about grammar or vocabulary, or just have a relaxed English conversation!",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  private saveHistory(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT_HISTORY, JSON.stringify(this.messages));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  public getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public resetSession(): void {
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    try {
      localStorage.setItem(STORAGE_KEY_SESSION_ID, this.sessionId);
    } catch {}
    this.messages = [
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: "Started a fresh practice session! What English topic or question would you like to explore together?",
        timestamp: new Date().toISOString(),
      },
    ];
    this.saveHistory();
  }

  public async sendMessage(userText: string): Promise<string> {
    const trimmed = userText.trim();
    if (!trimmed) return '';

    // Add user message to state
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(userMsg);
    this.saveHistory();

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Instance-Id': '8be74027c6a88af28442f3a82aec694bd36bb805292e6370068fa79c186f330a',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: this.sessionId,
          chatInput: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      const data = await response.json();
      let replyText = '';

      if (typeof data === 'string') {
        replyText = data;
      } else if (data.output) {
        replyText = data.output;
      } else if (data.text) {
        replyText = data.text;
      } else if (data.message) {
        replyText = data.message;
      } else if (Array.isArray(data) && data[0]?.output) {
        replyText = data[0].output;
      } else {
        replyText = JSON.stringify(data);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: replyText || "I received your message! How else can I help your English practice?",
        timestamp: new Date().toISOString(),
      };
      this.messages.push(botMsg);
      this.saveHistory();
      return replyText;
    } catch (err: unknown) {
      console.error('n8n webhook error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "I couldn't reach the chat coach server just now. Please verify your connection or try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      this.messages.push(errorMsg);
      this.saveHistory();
      throw err;
    }
  }
}

export const n8nChatService = new N8nChatService();
