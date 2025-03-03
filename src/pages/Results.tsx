import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoadingAnimation from '@/components/LoadingAnimation';
import PlanDocument from '@/components/PlanDocument';
import { useFormContext } from '@/context/FormContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "@/components/ui/use-toast";

const Results: React.FC = () => {
  const { formData } = useFormContext();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    if (!formData.personalityType.mbti && !formData.personalityType.enneagram && !formData.lifeObjectives) {
      navigate('/questionnaire');
    } else {
      const savedApiKey = localStorage.getItem('deepseek_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
        generatePlanWithAPI(savedApiKey);
      } else {
        setShowApiKeyInput(true);
        setTimeout(() => {
          setGeneratedPlan(generateMockPlan());
          setLoading(false);
        }, 3000);
      }
    }
  }, [formData, navigate]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', apiKey);
      setShowApiKeyInput(false);
      setLoading(true);
      generatePlanWithAPI(apiKey);
    } else {
      toast({
        title: language === 'en' ? "API Key Required" : "需要API密钥",
        description: language === 'en' ? "Please enter your DeepSeek API key" : "请输入您的DeepSeek API密钥",
        variant: "destructive",
      });
    }
  };

  const generatePlanWithAPI = async (key: string) => {
    try {
      const { personalityType, skillsAssessment, freeTimeAvailability, improvementGoals, lifeObjectives } = formData;
      
      const prompt = `
        创建一个个性化成长计划，基于以下用户资料：
        
        ${personalityType.mbti ? `MBTI类型: ${personalityType.mbti}` : ''}
        ${personalityType.enneagram ? `九型人格: ${personalityType.enneagram}` : ''}
        
        技能评估:
        ${Object.entries(skillsAssessment).map(([skill, level]) => `- ${skill.replace(/([A-Z])/g, ' $1').trim().replace('Skills', '')}: ${level}/10`).join('\n')}
        
        时间可用性:
        - 工作日: 每天${freeTimeAvailability.weekdayHours}小时
        - 周末: 每天${freeTimeAvailability.weekendHours}小时
        - 首选时间段: ${freeTimeAvailability.preferredTimeOfDay}
        
        改进目标:
        ${improvementGoals.filter(Boolean).map(goal => `- ${goal}`).join('\n')}
        
        人生目标:
        ${lifeObjectives}
        
        请以Markdown格式返回一个全面的个性化成长计划，包括：
        1. 个人概况分析
        2. 成长策略概述
        3. 每周时间安排建议
        4. 每日实践建议
        5. 为期三个月的进步路线图
        6. 推荐资源
        7. 进度追踪方法
      `;
      
      console.log("Sending request to DeepSeek API...");
      
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "你是一个个人成长顾问，专注于帮助用户根据他们的性格、技能和目标创建个性化的成长计划。" },
            { role: "user", content: prompt }
          ],
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      const planContent = data.choices[0].message.content;
      setGeneratedPlan(planContent);
      setLoading(false);
      
    } catch (error) {
      console.error("API调用失败:", error);
      toast({
        title: language === 'en' ? "Error" : "错误",
        description: language === 'en' 
          ? "Failed to generate plan with API. Using mock data instead." 
          : "无法使用API生成计划。使用模拟数据替代。",
        variant: "destructive",
      });
      
      setGeneratedPlan(generateMockPlan());
      setLoading(false);
    }
  };

  const generateMockPlan = () => {
    const { personalityType, skillsAssessment, freeTimeAvailability, improvementGoals, lifeObjectives } = formData;
    
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
    
    const skillsArray = Object.entries(skillsAssessment);
    const lowestSkills = skillsArray.sort((a, b) => a[1] - b[1]).slice(0, 2);
    const highestSkills = skillsArray.sort((a, b) => b[1] - a[1]).slice(0, 2);
    
    const timeFraming = freeTimeAvailability.weekdayHours >= 3 
      ? "您每天有足够的时间用于发展。" 
      : "由于工作日时间有限，请专注于高影响力、短时间的活动。";
    
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
            <span>{language === 'en' ? 'Back to Questionnaire' : '返回问卷'}</span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {language === 'en' ? 'Your Growth Plan' : '您的成长计划'}
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {loading 
              ? (language === 'en' ? "We're creating your personalized growth plan based on your input..." : "我们正在根据您的输入创建个性化成长计划...")
              : (language === 'en' ? "Your AI-generated plan is ready! Download or copy the content below." : "您的AI生成计划已准备就绪！下载或复制以下内容。")}
          </p>
        </motion.div>
        
        {showApiKeyInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 max-w-md mx-auto mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Enter DeepSeek API Key' : '输入DeepSeek API密钥'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {language === 'en' 
                ? "To generate a personalized plan with AI, enter your DeepSeek API key. Your key will be stored locally." 
                : "要使用AI生成个性化计划，请输入您的DeepSeek API密钥。您的密钥将存储在本地。"}
            </p>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <Label htmlFor="api-key">
                  {language === 'en' ? 'DeepSeek API Key' : 'DeepSeek API密钥'}
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={language === 'en' ? "Enter your API key" : "输入您的API密钥"}
                  className="mt-1 w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                {language === 'en' ? 'Generate with DeepSeek AI' : '使用DeepSeek AI生成'}
              </Button>
            </form>
          </motion.div>
        )}
        
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
                  {language === 'en' ? 'Back to Home' : '返回首页'}
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
