
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<string, Record<Language, string>> = {
  // Home page
  'home.title': {
    en: 'Personalized Growth Wisdom',
    zh: '个性化成长智慧'
  },
  'home.subtitle': {
    en: 'Discover your unique self-improvement path through AI-generated personalized plans based on your personality, skills, and life goals.',
    zh: '发现你的独特自我提升之路，通过AI生成的个性化计划，根据你的性格类型、技能和人生目标量身定制。'
  },
  'create.plan.button': {
    en: 'Create Your Growth Plan',
    zh: '生成您的成长计划'
  },
  'how.it.works': {
    en: 'How It Works',
    zh: '如何操作'
  },
  'share.profile': {
    en: 'Share Your Profile',
    zh: '分享您的个人资料'
  },
  'share.profile.desc': {
    en: 'Tell us about your personality type, skills, and time commitments to help us understand your unique personal traits.',
    zh: '告诉我们您的性格类型、技能和时间安排，帮助我们了解您的独特个人特点。'
  },
  'determine.goals': {
    en: 'Determine Your Goals',
    zh: '确定您的目标'
  },
  'determine.goals.desc': {
    en: 'Identify areas you want to improve and share your long-term life goals and aspirations.',
    zh: '确定您想要提升的领域，分享您的长期人生目标和愿望。'
  },
  'get.plan': {
    en: 'Get Your Custom Plan',
    zh: '获取您的定制计划'
  },
  'get.plan.desc': {
    en: 'Receive a personalized growth plan tailored to your personality, strengths, and improvement goals.',
    zh: '接收专为您的性格、优势和提升目标量身定制的个性化成长计划。'
  },
  // Navigation
  'back.home': {
    en: 'Back to Home',
    zh: '返回首页'
  },
  // Questionnaire page
  'create.plan': {
    en: 'Create Your Personalized Growth Plan',
    zh: '创建您的个性化成长计划'
  },
  'answer.questions': {
    en: 'Answer the following questions to help us generate a tailored growth plan for your unique profile',
    zh: '回答以下问题，帮助我们为您的独特个人资料生成量身定制的成长计划'
  },
  // Step labels
  'step.personality': {
    en: 'Personality',
    zh: '性格'
  },
  'step.skills': {
    en: 'Skills',
    zh: '技能'
  },
  'step.time': {
    en: 'Time',
    zh: '时间'
  },
  'step.goals': {
    en: 'Goals',
    zh: '目标'
  },
  'step.vision': {
    en: 'Vision',
    zh: '愿景'
  },
  // Personality page
  'personality.type': {
    en: 'Your Personality Type',
    zh: '您的性格类型'
  },
  'personality.description': {
    en: 'Share your personality test results for tailored recommendations',
    zh: '分享您的性格类型测试结果以获取量身定制的建议'
  },
  'mbti.type': {
    en: 'MBTI Type',
    zh: 'MBTI类型'
  },
  'select.mbti': {
    en: 'Select your MBTI type',
    zh: '选择您的MBTI类型'
  },
  'enneagram.type': {
    en: 'Enneagram Type',
    zh: '九型人格'
  },
  'select.enneagram': {
    en: 'Select your Enneagram type',
    zh: '选择您的九型人格'
  },
  'jungian.functions': {
    en: 'Jungian Cognitive Functions',
    zh: '荣格认知功能'
  },
  'assess.functions': {
    en: 'Rate your strength in each cognitive function (0-10)',
    zh: '评估您在每种认知功能中的强度（0-10）'
  },
  // Skills page
  'skills.assessment': {
    en: 'Skills Assessment',
    zh: '技能评估'
  },
  'skills.description': {
    en: 'Assess your current skill levels to help customize your growth plan',
    zh: '评估您当前的技能水平，以帮助定制您的成长计划'
  },
  'skill.beginner': {
    en: 'Beginner',
    zh: '初学者'
  },
  'skill.intermediate': {
    en: 'Intermediate',
    zh: '中级'
  }, 
  'skill.expert': {
    en: 'Expert',
    zh: '专家'
  },
  // Time page
  'time.availability': {
    en: 'Time Availability',
    zh: '时间安排'
  },
  'time.description': {
    en: "Let's understand how much time you can dedicate to personal growth",
    zh: '让我们了解您可以投入多少时间用于个人成长'
  },
  'weekday.hours': {
    en: 'Weekday Hours (per day)',
    zh: '工作日时间（每天）'
  },
  'weekend.hours': {
    en: 'Weekend Hours (per day)',
    zh: '周末时间（每天）'
  },
  'hours': {
    en: 'hours',
    zh: '小时'
  },
  'preferred.time': {
    en: 'Preferred Time of Day',
    zh: '首选时间段'
  },
  'time.morning': {
    en: 'Morning (5am - 11am)',
    zh: '早晨 (5am - 11am)'
  },
  'time.afternoon': {
    en: 'Afternoon (11am - 5pm)',
    zh: '下午 (11am - 5pm)'
  },
  'time.evening': {
    en: 'Evening (5pm - 10pm)',
    zh: '傍晚 (5pm - 10pm)'
  },
  'time.night': {
    en: 'Night (10pm - 5am)',
    zh: '夜晚 (10pm - 5am)'
  },
  // Goals page
  'improvement.goals': {
    en: 'Improvement Goals',
    zh: '提升目标'
  },
  'goals.description': {
    en: 'Select areas you want to focus on improving',
    zh: '选择您想要重点提升的领域'
  },
  'goal': {
    en: 'Goal',
    zh: '提升目标'
  },
  'select.goal': {
    en: 'Select an improvement goal',
    zh: '选择一个提升目标'
  },
  // Vision page
  'life.objectives': {
    en: 'Life Objectives',
    zh: '人生目标'
  },
  'vision.description': {
    en: 'Share your long-term aspirations and life vision',
    zh: '分享您的长期愿望和人生愿景'
  },
  'life.goals.question': {
    en: 'What are your main life goals and aspirations?',
    zh: '您的主要人生目标和愿望是什么？'
  },
  'life.goals.placeholder': {
    en: 'Describe your long-term vision, life goals, and what success means to you...',
    zh: '描述您的长期愿景、人生目标，以及成功对您意味着什么...'
  },
  // Navigation buttons
  'previous': {
    en: 'Previous',
    zh: '上一步'
  },
  'next': {
    en: 'Next',
    zh: '下一步'
  },
  'generate.plan': {
    en: 'Generate Plan',
    zh: '生成计划'
  },
};

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string, fallback: string): string => {
    return translations[key]?.[language] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
