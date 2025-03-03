import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingAnimation from '@/components/LoadingAnimation';
import PlanDocument from '@/components/PlanDocument';
import { useFormContext } from '@/context/FormContext';

const Results: React.FC = () => {
  const { formData } = useFormContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generatedPlan, setGeneratedPlan] = useState('');

  // Ensure user came from the questionnaire
  useEffect(() => {
    // Redirect if form is empty (user didn't fill the questionnaire)
    if (!formData.personalityType.mbti && !formData.personalityType.enneagram && !formData.lifeObjectives) {
      navigate('/questionnaire');
    } else {
      // Simulate AI generation time
      const timer = setTimeout(() => {
        setGeneratedPlan(generateMockPlan());
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [formData, navigate]);

  const generateMockPlan = () => {
    // This is a mock plan generator - in a real app, this would call an API with an LLM
    const { personalityType, skillsAssessment, freeTimeAvailability, improvementGoals, lifeObjectives } = formData;
    
    // Determine personality insights based on MBTI or Enneagram
    let personalityInsights = '';
    if (personalityType.mbti) {
      const isIntrovert = personalityType.mbti.startsWith('I');
      const isThinking = personalityType.mbti.includes('T');
      
      personalityInsights += isIntrovert 
        ? "作为一个内向者，您将受益于专注的独立学习和反思时间。 " 
        : "作为一个外向者，您将受益于协作学习和社交活动。 ";
      
      personalityInsights += isThinking
        ? "您的思维偏好表明了一种结构化的解决问题的方法。"
        : "您的感觉偏好表明了一种基于价值观的决策方法。";
    } else if (personalityType.enneagram) {
      if (personalityType.enneagram.includes("Type 1")) {
        personalityInsights = "作为一个1型人格，您的完美主义倾向可以通过专注于进步而不是完美来实现有意义的提升。";
      } else if (personalityType.enneagram.includes("Type 2")) {
        personalityInsights = "作为一个2型人格，请确保在帮助他人的同时，也要平衡好自我关怀和个人发展。";
      } else {
        personalityInsights = "您的九型人格表明了一种独特的成长方法，该方法平衡了您的核心动机与实际发展。";
      }
    }
    
    // Determine focus areas based on skills assessment
    const skillsArray = Object.entries(skillsAssessment);
    const lowestSkills = skillsArray.sort((a, b) => a[1] - b[1]).slice(0, 2);
    const highestSkills = skillsArray.sort((a, b) => b[1] - a[1]).slice(0, 2);
    
    // Create a time-based schedule
    const timeFraming = freeTimeAvailability.weekdayHours >= 3 
      ? "您每天有足够的时间用于发展。" 
      : "由于工作日时间有限，请专注于高影响力、短时间的活动。";
    
    // Create the plan content - now in Chinese
    return `# 您的个性化成长计划

## 个人资料摘要

${personalityType.mbti ? `**MBTI类型:** ${personalityType.mbti}` : ''}
${personalityType.enneagram ? `**九型人格:** ${personalityType.enneagram}` : ''}

**关键性格洞察:**
${personalityInsights}

## 成长策略概述

根据您的个人资料，本计划专注于:
* ${improvementGoals.slice(0, 3).join('\n* ')}
* 发挥您在${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}和${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}方面的优势
* 提升您的${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}和${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}

## 每周计划

${timeFraming} 您的最佳时间安排包括:

### 工作日 (${freeTimeAvailability.weekdayHours} 小时/天)
* 20分钟: 晨间反思和计划回顾
* 30分钟: 专注于${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}的技能发展
* 45分钟: 主要目标进展: ${improvementGoals[0] || '个人发展'}
* 25分钟: 阅读或学习与您的兴趣相关的内容

### 周末 (${freeTimeAvailability.weekendHours} 小时/天)
* 1小时: 深度学习${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}技能发展
* 1小时: 与${improvementGoals[1] || '次要目标'}相关的项目工作
* 30分钟: 与您的价值观一致的社交或社区活动
* 30分钟: 回顾并为即将到来的一周做计划

## 日常实践

### 晨间例行公事 (符合您的${freeTimeAvailability.preferredTimeOfDay}偏好)
* 5分钟正念冥想
* 审视您的日常优先事项
* 为当天设定一个主要意图

### 晚间回顾
* 反思当天的成就
* 记录一个见解或学习
* 为明天做准备

## 每月重点领域

### 第1个月：奠定基础
* 建立核心日常习惯
* 开始在${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}方面发展技能
* 为您的主要目标设定基准测量

### 第2个月：技能发展
* 增加对${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}的关注
* 在与${improvementGoals[0] || '您的主要目标'}相关的领域扩大您的网络
* 开始一个结合多个技能领域的项目

### 第3个月：整合与动力
* 在实际应用中连接不同的技能领域
* 评估进展并根据需要调整方法
* 通过新的挑战扩展您的舒适区

## 推荐资源

### 书籍
* 《微习惯》作者：詹姆斯·克利尔
* 《思维方式》作者：卡罗尔·德韦克
* 一本专门用于${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}发展的专业指南

### 课程
* 关于${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}的入门课程
* ${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}的高级工作坊

### 应用程序和工具
* 习惯追踪：Habitica或Loop Habit Tracker
* 学习：Coursera，LinkedIn Learning
* 反思：Day One Journal或类似工具

## 与人生目标的个人契合

您分享的人生目标关注于：
${lifeObjectives.slice(0, 150)}...

这个计划通过以下方式支持这些目标：
* 建立长期成功所需的基本技能
* 创建支持可持续成长的习惯
* 平衡即时改进与长期愿景

## 进度追踪

### 每周回顾问题
1. 我在优先目标上取得了什么进展？
2. 哪些习惯最有效？
3. 我遇到了哪些障碍，我如何解决它们？
4. 下周我应该做哪些调整？

### 每月评估
* 审视关键技能领域的可衡量进展
* 评估习惯的一致性和有效性
* 根据需要调整日常和每周时间表
* 庆祝成就并确定下一个成长边界

## 下一步

1. 审视整个计划
2. 安排您的第一周活动
3. 准备您的跟踪系统
4. 明天开始您的晨间例行公事
5. 安排您的第一次每周回顾

请记住，成长不是线性的。专注于一致性而不是完美，并根据您独特情况的发现调整这个计划。
`;
  };

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
            to="/questionnaire" 
            className="inline-flex items-center text-gray-600 hover:text-accent transition-colors duration-200"
          >
            <ChevronLeft size={20} />
            <span>返回问卷</span>
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
            您的成长计划
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {loading 
              ? "我们正在根据您的输入创建个性化成长计划..."
              : "您的AI生成计划已准备就绪！下载或复制以下内容。"}
          </p>
        </motion.div>
        
        {/* Loading or results */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingAnimation />
          </motion.div>
        ) : (
          <>
            <PlanDocument plan={generatedPlan} />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Button 
                asChild
                variant="outline" 
                className="floating-button"
              >
                <Link to="/">
                  <Home size={18} className="mr-2" />
                  返回首页
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Results;
