import { 
  UserProfile, 
  ConversationPartner, 
  ActiveConversation, 
  ConversationFeedback, 
  ReportItem, 
  BlockedUser, 
  ConversationMode, 
  RegionPreference, 
  EnglishLevel 
} from '../types';
import { ALL_INDIAN_STATES, REGIONS_DATA, getRegionForState } from '../data/regions';
import { CASUAL_TOPICS, INTERVIEW_TOPICS, KNOWLEDGE_TOPICS, DEBATE_TOPICS, RANDOM_SAFE_TOPICS, FEAR_FREE_TOPICS } from '../data/topics';

// Generated image assets with timestamped paths
import studentAvatar1 from '../assets/images/avatar_indian_student_1_1790583255046.jpg';
import studentAvatar2 from '../assets/images/avatar_indian_student_2_1790583267338.jpg';
import studentAvatar3 from '../assets/images/avatar_indian_student_3_1790583278880.jpg';

const STORAGE_KEY_USER = 'speakcircle_user_profile_v2';
const STORAGE_KEY_FEEDBACK = 'speakcircle_feedback_history_v2';
const STORAGE_KEY_REPORTS = 'speakcircle_reports_queue_v2';
const STORAGE_KEY_BLOCKED = 'speakcircle_blocked_users_v2';
const STORAGE_KEY_ADMIN_EVENTS = 'speakcircle_admin_events_v2';

// Seeded authentic peers across India
export const SAMPLE_PEERS: ConversationPartner[] = [
  {
    id: 'peer-1',
    displayName: 'Aarav K.',
    state: 'Telangana',
    region: 'South India',
    englishLevel: 'Intermediate',
    interests: ['Technology', 'College Life', 'Campus Placements'],
    avatarUrl: studentAvatar1,
    trustStatus: 'Trusted Communicator',
    isSimulated: true,
  },
  {
    id: 'peer-2',
    displayName: 'Ananya S.',
    state: 'Punjab',
    region: 'North India',
    englishLevel: 'Comfortable',
    interests: ['Movies', 'Travel', 'Daily Life'],
    avatarUrl: studentAvatar2,
    trustStatus: 'Trusted Communicator',
    isSimulated: true,
  },
  {
    id: 'peer-3',
    displayName: 'Rohit M.',
    state: 'Maharashtra',
    region: 'West India',
    englishLevel: 'Intermediate',
    interests: ['Startups', 'Interview Practice', 'Science'],
    avatarUrl: studentAvatar3,
    trustStatus: 'Active Speaker',
    isSimulated: true,
  },
  {
    id: 'peer-4',
    displayName: 'Priya D.',
    state: 'West Bengal',
    region: 'East India',
    englishLevel: 'Comfortable',
    interests: ['Literature', 'Environment', 'Food'],
    avatarUrl: studentAvatar2,
    trustStatus: 'Trusted Communicator',
    isSimulated: true,
  },
  {
    id: 'peer-5',
    displayName: 'Lalrempuia Z.',
    state: 'Mizoram',
    region: 'Northeast India',
    englishLevel: 'Advanced',
    interests: ['Music', 'Debates', 'Higher Studies'],
    avatarUrl: studentAvatar1,
    trustStatus: 'Trusted Communicator',
    isSimulated: true,
  },
  {
    id: 'peer-6',
    displayName: 'Divya N.',
    state: 'Karnataka',
    region: 'South India',
    englishLevel: 'Basic',
    interests: ['Casual', 'Hobbies', 'Friendship'],
    avatarUrl: studentAvatar2,
    trustStatus: 'Active Speaker',
    isSimulated: true,
  },
  {
    id: 'peer-7',
    displayName: 'Vikas T.',
    state: 'Rajasthan',
    region: 'North India',
    englishLevel: 'Intermediate',
    interests: ['Current Affairs', 'General Knowledge', 'Books'],
    avatarUrl: studentAvatar3,
    trustStatus: 'Active Speaker',
    isSimulated: true,
  },
  {
    id: 'peer-8',
    displayName: 'Kiran B.',
    state: 'Kerala',
    region: 'South India',
    englishLevel: 'Comfortable',
    interests: ['Travel', 'Interview Prep', 'Career'],
    avatarUrl: studentAvatar1,
    trustStatus: 'Trusted Communicator',
    isSimulated: true,
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-self',
  displayName: 'Priyanka V.',
  ageConfirmed: true,
  state: 'Andhra Pradesh',
  region: 'South India',
  englishLevel: 'Intermediate',
  conversationInterests: ['Career', 'College Life', 'Movies', 'Technology'],
  preferredDuration: 10,
  fearFreeMode: false,
  avatarUrl: studentAvatar2,
  trustStatus: 'Learner',
  completedConversations: 4,
  totalSpeakingMinutes: 38,
  streakDays: 3,
  statesSpokenWith: ['Telangana', 'Maharashtra', 'Karnataka'],
  createdAt: new Date().toISOString(),
};

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    reportedUserId: 'usr-flagged-98',
    reportedUserName: 'Unknown User #98',
    reporterId: 'usr-random-12',
    reason: 'Asking for personal information',
    details: 'Kept insisting on getting personal phone number and college hostel address despite refusal.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'pending',
  },
  {
    id: 'rep-2',
    reportedUserId: 'usr-flagged-44',
    reportedUserName: 'Guest User #44',
    reporterId: 'usr-random-31',
    reason: 'Abusive language',
    details: 'Used offensive slurs when partner made a small pronunciation error.',
    timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    status: 'action_taken',
    actionTaken: 'Account issued formal warning and restricted from matching for 24 hours.',
  },
];

class SpeakCircleService {
  private user: UserProfile;
  private feedbackHistory: ConversationFeedback[];
  private reportsQueue: ReportItem[];
  private blockedUsers: BlockedUser[];
  private channel: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.user = this.loadUser();
    this.feedbackHistory = this.loadFeedback();
    this.reportsQueue = this.loadReports();
    this.blockedUsers = this.loadBlocked();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('speakcircle_cross_tab_mesh');
      } catch (err) {
        console.warn('BroadcastChannel not supported', err);
      }
    }
  }

  private loadUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  }

  private loadFeedback(): ConversationFeedback[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'fb-1',
        conversationId: 'conv-101',
        partnerName: 'Aarav K.',
        partnerRegion: 'Telangana',
        mode: 'Casual',
        durationSeconds: 600,
        feeling: 'Comfortable',
        rating: 5,
        practiceSuggestions: [
          'Excellent pace! You paused naturally to collect your thoughts without hesitation.',
          'Try incorporating more descriptive adjectives next time when explaining your favorite dishes.',
        ],
        topicsDiscussed: ['College routines', 'Local street foods in Hyderabad'],
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'fb-2',
        conversationId: 'conv-102',
        partnerName: 'Rohit M.',
        partnerRegion: 'Maharashtra',
        mode: 'Interview',
        durationSeconds: 720,
        feeling: 'Helpful',
        rating: 5,
        practiceSuggestions: [
          'Great use of the STAR method when answering the project question.',
          'Keep your answer to "Tell me about yourself" crisp and focused under 90 seconds.',
        ],
        topicsDiscussed: ['Self-introduction', 'College capstone project'],
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ];
  }

  private loadReports(): ReportItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REPORTS;
  }

  private loadBlocked(): BlockedUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLOCKED);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getUser(): UserProfile {
    return { ...this.user };
  }

  public updateUser(updates: Partial<UserProfile>) {
    this.user = { ...this.user, ...updates };
    // Recalculate trust status based on internal criteria
    if (this.user.completedConversations >= 10 && this.user.totalSpeakingMinutes >= 60) {
      this.user.trustStatus = 'Trusted Communicator';
    } else if (this.user.completedConversations >= 3) {
      this.user.trustStatus = 'Active Speaker';
    }
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public getFeedbackHistory(): ConversationFeedback[] {
    return [...this.feedbackHistory];
  }

  public addFeedback(feedback: ConversationFeedback) {
    this.feedbackHistory.unshift(feedback);
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(this.feedbackHistory));
    } catch (e) {
      console.error(e);
    }

    // Update user stats
    const minutesAdded = Math.round(feedback.durationSeconds / 60);
    const updatedStates = Array.from(new Set([...this.user.statesSpokenWith, feedback.partnerRegion]));

    this.updateUser({
      completedConversations: this.user.completedConversations + 1,
      totalSpeakingMinutes: this.user.totalSpeakingMinutes + Math.max(1, minutesAdded),
      statesSpokenWith: updatedStates,
    });
  }

  public getReportsQueue(): ReportItem[] {
    return [...this.reportsQueue];
  }

  public submitReport(partner: ConversationPartner, reason: ReportItem['reason'], details: string) {
    const report: ReportItem = {
      id: `rep-${Date.now()}`,
      reportedUserId: partner.id,
      reportedUserName: partner.displayName,
      reporterId: this.user.id,
      reason,
      details,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    this.reportsQueue.unshift(report);
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reportsQueue));
    } catch (e) {
      console.error(e);
    }

    // Automatically block the reported user
    this.blockUser(partner.id, partner.displayName, partner.state);
    this.notify();
    return report;
  }

  public updateReportStatus(reportId: string, status: ReportItem['status'], actionTaken?: string) {
    this.reportsQueue = this.reportsQueue.map(r => {
      if (r.id === reportId) {
        return { ...r, status, actionTaken: actionTaken || r.actionTaken };
      }
      return r;
    });
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reportsQueue));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public getBlockedUsers(): BlockedUser[] {
    return [...this.blockedUsers];
  }

  public blockUser(userId: string, displayName: string, state: string) {
    if (this.blockedUsers.some(b => b.userId === userId)) return;
    this.blockedUsers.push({
      userId,
      displayName,
      state,
      blockedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(this.blockedUsers));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public unblockUser(userId: string) {
    this.blockedUsers = this.blockedUsers.filter(b => b.userId !== userId);
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(this.blockedUsers));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  // Find partner matching algorithm with rule priority
  public findPartner(
    regionPreference: RegionPreference,
    mode: ConversationMode,
    fearFree: boolean
  ): ConversationPartner {
    const blockedIds = new Set(this.blockedUsers.map(b => b.userId));
    let pool = SAMPLE_PEERS.filter(p => !blockedIds.has(p.id));

    if (regionPreference === 'same_state') {
      const match = pool.filter(p => p.state === this.user.state);
      if (match.length > 0) pool = match;
    } else if (regionPreference === 'diff_state') {
      const match = pool.filter(p => p.state !== this.user.state);
      if (match.length > 0) pool = match;
    } else if (regionPreference === 'same_region') {
      const match = pool.filter(p => p.region === this.user.region);
      if (match.length > 0) pool = match;
    } else if (regionPreference === 'diff_region') {
      const match = pool.filter(p => p.region !== this.user.region);
      if (match.length > 0) pool = match;
    }

    // Pick random from filtered pool
    const selected = pool[Math.floor(Math.random() * pool.length)] || SAMPLE_PEERS[0];
    return selected;
  }

  // Pick initial topic based on mode
  public getInitialTopic(mode: ConversationMode, fearFree: boolean): string {
    if (fearFree) {
      return FEAR_FREE_TOPICS[Math.floor(Math.random() * FEAR_FREE_TOPICS.length)];
    }
    switch (mode) {
      case 'Casual':
        return CASUAL_TOPICS[Math.floor(Math.random() * CASUAL_TOPICS.length)];
      case 'Interview':
        return INTERVIEW_TOPICS[0].question;
      case 'Knowledge':
        return KNOWLEDGE_TOPICS[Math.floor(Math.random() * KNOWLEDGE_TOPICS.length)];
      case 'Debate':
        return DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
      case 'Random':
      default:
        return RANDOM_SAFE_TOPICS[Math.floor(Math.random() * RANDOM_SAFE_TOPICS.length)];
    }
  }

  // Safety checker for automated alerts
  public checkModerationTrigger(text: string): { flagged: boolean; reason?: string } {
    const lower = text.toLowerCase();
    const sensitiveTriggers = [
      { pattern: /(phone|mobile|whatsapp|contact|call me at|\+91|\d{10})/i, reason: 'Requesting personal contact details' },
      { pattern: /(instagram|insta handle|facebook|snapchat|telegram|id)/i, reason: 'Requesting external social media accounts' },
      { pattern: /(fuck|bitch|bastard|asshole|idiot|stupid|shut up)/i, reason: 'Potentially disrespectful language' },
    ];

    for (const t of sensitiveTriggers) {
      if (t.pattern.test(lower)) {
        return { flagged: true, reason: t.reason };
      }
    }
    return { flagged: false };
  }
}

export const speakCircleService = new SpeakCircleService();
