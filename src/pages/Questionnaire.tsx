
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import QuestionnaireForm from '@/components/QuestionnaireForm';

const Questionnaire: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-accent transition-colors duration-200"
          >
            <ChevronLeft size={20} />
            <span>返回首页</span>
          </Link>
        </motion.div>
        
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            创建您的个性化成长计划
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            回答以下问题，帮助我们为您的独特个人资料生成量身定制的成长计划
          </p>
        </motion.div>
        
        {/* Questionnaire form */}
        <QuestionnaireForm />
      </div>
    </div>
  );
};

export default Questionnaire;
