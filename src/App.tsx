import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ConversationPartner, 
  ConversationMode, 
  RegionPreference, 
  ConversationFeedback, 
  ReportItem, 
  BlockedUser, 
  DailyChallenge, 
  IndianRegion 
} from './types';
import { speakCircleService } from './services/store';

// Core Components
import { TopNav } from './components/TopNav';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MatchingScreen } from './components/MatchingScreen';
import { VoiceRoom } from './components/VoiceRoom';
import { PostConversationFeedback } from './components/PostConversationFeedback';
import { DiscoverScreen } from './components/DiscoverScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ChatBoardScreen } from './components/ChatBoardScreen';

// Modals
import { OnboardingModal } from './components/OnboardingModal';
import { SafetyCenterModal } from './components/SafetyCenterModal';
import { ReportModal } from './components/ReportModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

export default function App() {
  const [user, setUser] = useState<UserProfile>(speakCircleService.getUser());
  const [feedbackHistory, setFeedbackHistory] = useState<ConversationFeedback[]>(
    speakCircleService.getFeedbackHistory()
  );
  const [reportsQueue, setReportsQueue] = useState<ReportItem[]>(
    speakCircleService.getReportsQueue()
  );
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(
    speakCircleService.getBlockedUsers()
  );

  // Navigation & Screen Management
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [screenState, setScreenState] = useState<'main' | 'matching' | 'voiceroom' | 'feedback'>(
    'main'
  );

  // Matching & Active Call States
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('Casual');
  const [selectedRegionPref, setSelectedRegionPref] = useState<RegionPreference>('diff_state');
  const [selectedDuration, setSelectedDuration] = useState<5 | 10 | 15>(user.preferredDuration || 10);
  const [activePartner, setActivePartner] = useState<ConversationPartner | null>(null);
  const [activeTopic, setActiveTopic] = useState<string>('');
  const [lastCallDurationSeconds, setLastCallDurationSeconds] = useState<number>(0);
  const [lastTopicsDiscussed, setLastTopicsDiscussed] = useState<string[]>([]);

  // Modals visibility
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSafetyCenter, setShowSafetyCenter] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [reportingPartner, setReportingPartner] = useState<ConversationPartner | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = speakCircleService.subscribe(() => {
      setUser(speakCircleService.getUser());
      setFeedbackHistory(speakCircleService.getFeedbackHistory());
      setReportsQueue(speakCircleService.getReportsQueue());
      setBlockedUsers(speakCircleService.getBlockedUsers());
    });
    return () => unsubscribe();
  }, []);

  // Update user preference
  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    speakCircleService.updateUser(updates);
  };

  // Launch Matching
  const handleStartMatching = () => {
    setScreenState('matching');
  };

  // Matched with a partner
  const handlePartnerMatched = (partner: ConversationPartner) => {
    setActivePartner(partner);
    const initialTopic = speakCircleService.getInitialTopic(selectedMode, user.fearFreeMode);
    setActiveTopic(initialTopic);
    setScreenState('voiceroom');
  };

  // End Call from VoiceRoom
  const handleEndCall = (elapsedSeconds: number, topics: string[]) => {
    setLastCallDurationSeconds(elapsedSeconds);
    setLastTopicsDiscussed(topics);
    setScreenState('feedback');
  };

  // Save feedback from PostConversationFeedback
  const handleSaveFeedback = (feedback: ConversationFeedback) => {
    speakCircleService.addFeedback(feedback);
  };

  // Quick match from Discover tab by region
  const handleQuickMatchRegion = (region: IndianRegion) => {
    setSelectedRegionPref('diff_state');
    setSelectedMode('Casual');
    setCurrentTab('home');
    setScreenState('matching');
  };

  // Practice challenge matching
  const handleStartChallengeCall = (challenge: DailyChallenge) => {
    setSelectedMode('Challenge');
    setActiveTopic(challenge.prompt);
    setSelectedDuration(5);
    setScreenState('matching');
  };

  // Report submission
  const handleSubmitReport = (reason: ReportItem['reason'], details: string) => {
    if (reportingPartner) {
      speakCircleService.submitReport(reportingPartner, reason, details);
      setReportingPartner(null);
      if (screenState === 'voiceroom') {
        setScreenState('main');
        setCurrentTab('home');
      }
    }
  };

  // Block partner directly
  const handleBlockActivePartner = () => {
    if (activePartner) {
      speakCircleService.blockUser(activePartner.id, activePartner.displayName, activePartner.state);
      setScreenState('main');
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Contract (Visible during main navigation and feedback) */}
      {screenState !== 'matching' && screenState !== 'voiceroom' && (
        <TopNav
          onOpenSafety={() => setShowSafetyCenter(true)}
          onOpenAdmin={() => setShowAdminDashboard(true)}
          onOpenChat={() => setCurrentTab('chat')}
          activeScreen={currentTab}
        />
      )}

      {/* Main Tab Screens */}
      {screenState === 'main' && (
        <main className="min-h-[calc(100vh-3.5rem)]">
          {currentTab === 'home' && (
            <HomeScreen
              user={user}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              selectedRegionPref={selectedRegionPref}
              onSelectRegionPref={setSelectedRegionPref}
              duration={selectedDuration}
              onSelectDuration={setSelectedDuration}
              fearFree={user.fearFreeMode}
              onToggleFearFree={() => handleUpdateUser({ fearFreeMode: !user.fearFreeMode })}
              onStartMatching={handleStartMatching}
              onOpenSafety={() => setShowSafetyCenter(true)}
              onOpenChatBoard={() => setCurrentTab('chat')}
            />
          )}

          {currentTab === 'discover' && (
            <DiscoverScreen
              onQuickMatchRegion={handleQuickMatchRegion}
              userState={user.state}
            />
          )}

          {currentTab === 'chat' && (
            <ChatBoardScreen onOpenVoiceRoom={handleStartMatching} />
          )}

          {currentTab === 'practice' && (
            <PracticeScreen onStartChallengeCall={handleStartChallengeCall} />
          )}

          {currentTab === 'progress' && (
            <ProgressScreen user={user} feedbackHistory={feedbackHistory} />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              user={user}
              blockedUsers={blockedUsers}
              onUpdateUser={handleUpdateUser}
              onUnblockUser={id => speakCircleService.unblockUser(id)}
              onOpenSafety={() => setShowSafetyCenter(true)}
              onOpenAdmin={() => setShowAdminDashboard(true)}
            />
          )}
        </main>
      )}

      {/* Matching Screen Overlay */}
      {screenState === 'matching' && (
        <MatchingScreen
          mode={selectedMode}
          regionPref={selectedRegionPref}
          duration={selectedDuration}
          fearFree={user.fearFreeMode}
          onMatched={handlePartnerMatched}
          onCancel={() => setScreenState('main')}
        />
      )}

      {/* 1-to-1 Voice Room */}
      {screenState === 'voiceroom' && activePartner && (
        <VoiceRoom
          user={user}
          partner={activePartner}
          mode={selectedMode}
          initialTopic={activeTopic}
          durationMinutes={selectedDuration}
          fearFree={user.fearFreeMode}
          onEndCall={handleEndCall}
          onReportPartner={() => setReportingPartner(activePartner)}
          onBlockPartner={handleBlockActivePartner}
        />
      )}

      {/* Post-Conversation Feedback Screen */}
      {screenState === 'feedback' && activePartner && (
        <PostConversationFeedback
          partner={activePartner}
          mode={selectedMode}
          durationSeconds={lastCallDurationSeconds}
          topicsDiscussed={lastTopicsDiscussed}
          onSubmitFeedback={handleSaveFeedback}
          onTalkAgain={() => {
            setScreenState('matching');
          }}
          onReturnHome={() => {
            setScreenState('main');
            setCurrentTab('home');
          }}
          onReportPartner={() => setReportingPartner(activePartner)}
        />
      )}

      {/* Bottom Navigation for Mobile & Touch (Visible in Main Screens) */}
      {screenState === 'main' && (
        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      )}

      {/* Modals & Overlays */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={updates => {
          handleUpdateUser(updates);
          setShowOnboarding(false);
        }}
      />

      <SafetyCenterModal
        isOpen={showSafetyCenter}
        onClose={() => setShowSafetyCenter(false)}
      />

      {reportingPartner && (
        <ReportModal
          partner={reportingPartner}
          isOpen={true}
          onClose={() => setReportingPartner(null)}
          onSubmit={handleSubmitReport}
        />
      )}

      <AdminDashboardModal
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
        reports={reportsQueue}
        onUpdateReportStatus={(id, status, action) =>
          speakCircleService.updateReportStatus(id, status, action)
        }
      />
    </div>
  );
}
