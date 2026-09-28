import { ConversationCard, DailyChallenge } from '../types';

export const CASUAL_TOPICS = [
  'What is your favorite local food or street snack in your city?',
  'What kind of movies or web series do you enjoy watching on weekends?',
  'Tell me about your college or work routine. What does a typical Tuesday look like?',
  'What is one place in India you have always wanted to travel to and why?',
  'Do you listen to music while studying or traveling? What are your favorite artists?',
  'What is one hobby or interest you picked up recently?',
  'How do you usually relax when you have free time on a Sunday afternoon?',
  'If a friend visits your hometown for 24 hours, where would you take them first?',
];

export const INTERVIEW_TOPICS = [
  {
    question: 'Tell me about yourself and your background.',
    interviewerTip: 'Listen for structured response: past studies, current focus, future goals.',
    candidateTip: 'Keep it to 90 seconds. Focus on your journey, key skills, and passion.',
  },
  {
    question: 'What do you consider your greatest strength and an area you are working on?',
    interviewerTip: 'Encourage real examples rather than textbook answers.',
    candidateTip: 'Mention how your strength helped in a real project, and frame your weak area as an active learning goal.',
  },
  {
    question: 'Describe a challenging project or situation you faced and how you handled it.',
    interviewerTip: 'Look for STAR format: Situation, Task, Action, Result.',
    candidateTip: 'Describe the obstacle clearly and highlight what specific action you personally took.',
  },
  {
    question: 'Where do you see yourself professionally in the next three to five years?',
    interviewerTip: 'Notice their ambition, clarity, and commitment to learning.',
    candidateTip: 'Talk about the skills and responsibilities you wish to master.',
  },
  {
    question: 'Why are you interested in this industry or career path?',
    interviewerTip: 'Probe for genuine curiosity vs generic buzzwords.',
    candidateTip: 'Share the specific moment or interest that sparked your motivation.',
  },
];

export const KNOWLEDGE_TOPICS = [
  'How do you think Artificial Intelligence is changing education and jobs in India?',
  'What is an exciting scientific discovery or space mission (like Chandrayaan) that impressed you?',
  'Electric vehicles in Indian cities: What are the opportunities and practical challenges?',
  'How can Indian colleges better prepare students for practical industry skills?',
  'Renewable energy (Solar & Wind) in India: Do you see it in your state?',
  'The impact of digital payments (UPI) on everyday life in small towns and big cities.',
];

export const DEBATE_TOPICS = [
  'Should attendance in college lectures be strictly mandatory, or should it be optional?',
  'Work from home vs working from an office: Which builds better career growth?',
  'Do social media platforms do more to connect people or create loneliness?',
  'Should coding be taught to all students in school regardless of their field?',
  'Is it better to specialize deeply in one skill or be a generalist who knows many things?',
];

export const RANDOM_SAFE_TOPICS = [
  'If you could wake up tomorrow having mastered any one musical instrument or language, what would it be?',
  'What is one piece of advice an elder or teacher gave you that you still remember?',
  'What was your favorite festival celebration this past year?',
  'Do you prefer quiet mountain hill stations or sunny beaches for vacation?',
  'What is one habit you started this year that has genuinely helped you?',
  'What book or podcast recently made you think differently about something?',
  'What is something people often misunderstand about your home state or language?',
  'If you had to teach someone one skill you are good at, what would you teach?',
];

export const FEAR_FREE_TOPICS = [
  'What is your favorite drink: Masala chai, South Indian filter coffee, or cold lassi?',
  'What is your favorite comfort food when it rains?',
  'Do you like early mornings or staying up late at night?',
  'What is one movie you can watch over and over without getting bored?',
  'What is your favorite season of the year in your city?',
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-1',
    dayNumber: 1,
    title: 'Introduce Yourself Confidently',
    prompt: 'Speak for 60 seconds about your name, where you are from in India, and one thing you enjoy doing.',
    category: 'Foundations',
    durationHint: '60 seconds',
    sampleTips: [
      'Speak at a steady, calm pace.',
      'Remember: pausing to breathe is completely normal and shows confidence.',
    ],
  },
  {
    id: 'ch-2',
    dayNumber: 2,
    title: 'Describe Your Favorite Movie or Story',
    prompt: 'Tell your partner about a movie or book you love. What happens, and why did you like the main character?',
    category: 'Storytelling',
    durationHint: '90 seconds',
    sampleTips: [
      'Use connecting words: "At first...", "Then...", "What touched me most was..."',
      'Do not worry about remembering actor names; focus on describing the feeling.',
    ],
  },
  {
    id: 'ch-3',
    dayNumber: 3,
    title: 'Your Hometown Guide',
    prompt: 'Imagine your partner is visiting your town for the very first time. Describe 2 places they must visit and 1 dish they must taste.',
    category: 'Descriptive Spoken English',
    durationHint: '2 minutes',
    sampleTips: [
      'Use sensory words: aroma, bustling, historic, peaceful.',
      'Paint a picture of what people wear or how the air feels.',
    ],
  },
  {
    id: 'ch-4',
    dayNumber: 4,
    title: 'Explain Your Dream Project or Job',
    prompt: 'Talk about what kind of work makes you lose track of time. What problem would you love to solve in the real world?',
    category: 'Career & Ambition',
    durationHint: '2 minutes',
    sampleTips: [
      'Focus on the impact you want to create.',
      'Practice expressing enthusiasm through voice modulation.',
    ],
  },
  {
    id: 'ch-5',
    dayNumber: 5,
    title: 'A Challenge You Solved',
    prompt: 'Share a small obstacle or tough week you faced recently (an exam, a project, or learning something new) and how you overcame it.',
    category: 'Reflection',
    durationHint: '2 minutes',
    sampleTips: [
      'Outline the problem first, then the solution.',
      'Emphasize what you learned about yourself.',
    ],
  },
];

export const CONVERSATION_CARDS: ConversationCard[] = [
  {
    id: 'c-1',
    category: 'Fun',
    question: 'If you had an unlimited budget for one dream weekend trip in India, where would you go?',
    followUp: 'Who would you take along with you?',
  },
  {
    id: 'c-2',
    category: 'College',
    question: 'What is one class or project in college that taught you something truly memorable?',
    followUp: 'Was it because of the teacher or the subject itself?',
  },
  {
    id: 'c-3',
    category: 'Career',
    question: 'What is one skill you want to develop strongly before the end of this year?',
    followUp: 'How are you currently practicing it?',
  },
  {
    id: 'c-4',
    category: 'Technology',
    question: 'Which smartphone app has genuinely made your daily life easier or more productive?',
    followUp: 'Is there any app you recently uninstalled to save time?',
  },
  {
    id: 'c-5',
    category: 'Travel',
    question: 'Have you ever traveled by train for a long journey across different states in India? How was the experience?',
    followUp: 'What did you notice changing out the window—scenery, food, or language?',
  },
  {
    id: 'c-6',
    category: 'Personal growth',
    question: 'How has your comfort with spoken English changed over the past year?',
    followUp: 'What helped you make the biggest step forward?',
  },
  {
    id: 'c-7',
    category: 'Interview',
    question: 'What was a time you worked in a team and had to resolve a difference of opinion?',
    followUp: 'What was the final outcome for the project?',
  },
  {
    id: 'c-8',
    category: 'Debate',
    question: 'Should colleges focus more on theoretical research or practical vocational internships?',
    followUp: 'What would your ideal college curriculum look like?',
  },
];

export const RESCUE_QUESTIONS = [
  'What is the weather like in your city today?',
  'What is one dish from your home state that you recommend everyone should try?',
  'What are you looking forward to doing this coming weekend?',
  'What kind of English content do you enjoy most: YouTube videos, English podcasts, or books?',
  'What motivated you to practice speaking English today?',
];
