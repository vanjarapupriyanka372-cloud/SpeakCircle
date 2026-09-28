export type IndianRegion = 
  | 'South India' 
  | 'North India' 
  | 'West India' 
  | 'East India' 
  | 'Northeast India';

export type EnglishLevel = 
  | 'Beginner' 
  | 'Basic' 
  | 'Intermediate' 
  | 'Comfortable' 
  | 'Advanced';

export type ConversationMode = 
  | 'Casual' 
  | 'Interview' 
  | 'Knowledge' 
  | 'Debate' 
  | 'Random' 
  | 'Challenge';

export type RegionPreference = 
  | 'any' 
  | 'same_state' 
  | 'diff_state' 
  | 'same_region' 
  | 'diff_region';

export type LevelPreference = 
  | 'similar' 
  | 'more_comfortable' 
  | 'any';

export interface UserProfile {
  id: string;
  displayName: string;
  ageConfirmed: boolean;
  state: string;
  region: IndianRegion;
  englishLevel: EnglishLevel;
  conversationInterests: string[];
  preferredDuration: 5 | 10 | 15;
  fearFreeMode: boolean;
  avatarUrl?: string;
  trustStatus: 'Learner' | 'Active Speaker' | 'Trusted Communicator';
  completedConversations: number;
  totalSpeakingMinutes: number;
  streakDays: number;
  statesSpokenWith: string[];
  createdAt: string;
}

export interface ConversationPartner {
  id: string;
  displayName: string;
  state: string;
  region: IndianRegion;
  englishLevel: EnglishLevel;
  interests: string[];
  avatarUrl?: string;
  trustStatus: 'Learner' | 'Active Speaker' | 'Trusted Communicator';
  isSimulated?: boolean;
}

export interface ActiveConversation {
  id: string;
  partner: ConversationPartner;
  mode: ConversationMode;
  topic: string;
  totalDurationSeconds: number;
  remainingSeconds: number;
  isMuted: boolean;
  partnerMuted: boolean;
  isSpeaking: boolean;
  partnerSpeaking: boolean;
  interviewRole?: 'interviewer' | 'candidate';
  activeCardIndex: number;
}

export interface ConversationFeedback {
  id: string;
  conversationId: string;
  partnerName: string;
  partnerRegion: string;
  mode: ConversationMode;
  durationSeconds: number;
  feeling: 'Comfortable' | 'Helpful' | 'Difficult' | 'Uncomfortable';
  rating: number; // 1-5
  practiceSuggestions: string[];
  topicsDiscussed: string[];
  timestamp: string;
}

export interface ReportItem {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reason: 
    | 'Abusive language' 
    | 'Harassment' 
    | 'Sexual/inappropriate conversation' 
    | 'Hate speech' 
    | 'Threatening behavior' 
    | 'Spam' 
    | 'Asking for personal information' 
    | 'Repeated unwanted interaction' 
    | 'Other';
  details: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  actionTaken?: string;
}

export interface BlockedUser {
  userId: string;
  displayName: string;
  state: string;
  blockedAt: string;
}

export interface DailyChallenge {
  id: string;
  dayNumber: number;
  title: string;
  prompt: string;
  category: string;
  durationHint: string;
  sampleTips: string[];
}

export interface ConversationCard {
  id: string;
  category: 'Fun' | 'College' | 'Career' | 'Technology' | 'Travel' | 'Personal growth' | 'Interview' | 'Debate';
  question: string;
  followUp: string;
}
