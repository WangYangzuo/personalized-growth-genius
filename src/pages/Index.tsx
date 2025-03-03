
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import PersonalityTestLinks from '@/components/PersonalityTestLinks';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

const Index: React.FC = () => {
  const { language, t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-20 relative overflow-hidden">
        {/* Language switcher */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
        
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4">
            {t('home.title', '个性化成长智慧')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.subtitle', '发现你的独特自我提升之路，通过AI生成的个性化计划，根据你的性格类型、技能和人生目标量身定制。')}
          </p>
        </motion.div>
        
        {/* Main CTA button - 修改按钮，确保在移动设备上也能正常工作 */}
        <motion.div 
          className="relative flex justify-center my-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link to="/questionnaire" className="w-auto">
            <motion.button 
              className="floating-button group bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full text-lg font-medium shadow-button flex items-center"
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ y: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="flex items-center space-x-2">
                <span>{t('create.plan.button', '生成您的成长计划')}</span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 5 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 1 
                  }}
                >
                  <ChevronRight size={20} />
                </motion.div>
              </span>
              <motion.div 
                className="absolute inset-0 rounded-full -z-10 bg-accent/20 blur"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.3, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.5
                }}
              />
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Personality test links */}
        <PersonalityTestLinks />
        
        {/* Features section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-24 relative"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
            {t('how.it.works', '如何操作')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t('share.profile', '分享您的个人资料'),
                description: t('share.profile.desc', '告诉我们您的性格类型、技能和时间安排，帮助我们了解您的独特个人特点。'),
                delay: 0
              },
              {
                title: t('determine.goals', '确定您的目标'),
                description: t('determine.goals.desc', '确定您想要提升的领域，分享您的长期人生目标和愿望。'),
                delay: 0.15
              },
              {
                title: t('get.plan', '获取您的定制计划'),
                description: t('get.plan.desc', '接收专为您的性格、优势和提升目标量身定制的个性化成长计划。'),
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-panel p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + feature.delay, duration: 0.5 }}
              >
                <div className="text-accent font-bold text-xl mb-1">
                  {`0${index + 1}`}
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
