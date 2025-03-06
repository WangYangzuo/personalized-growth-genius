
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingAnimation from '@/components/LoadingAnimation';
import PlanDocument from '@/components/PlanDocument';
import { useFormContext } from '@/context/FormContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from "@/components/ui/use-toast";

// Embedded API key - hardcoded for this application
const DEEPSEEK_API_KEY = 'sk-0dea084e0b0d4f0fa927e79d276ba180';

const Results: React.FC = () => {
  const { formData } = useFormContext();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generatedPlan, setGeneratedPlan] = useState('');

  useEffect(() => {
    if (!formData.personalityType.mbti && !formData.personalityType.enneagram && !formData.lifeObjectives) {
      navigate('/questionnaire');
    } else {
      // Directly use the embedded API key
      generatePlanWithAPI(DEEPSEEK_API_KEY);
    }
  }, [formData, navigate]);

  const generatePlanWithAPI = async (key: string) => {
    try {
      const { personalityType, currentSituation, freeTimeAvailability, improvementGoals, lifeObjectives } = formData;
      
      // Format the enneagram type with wing if both are provided
      let formattedEnneagram = '';
      if (personalityType.enneagram && personalityType.enneagramWing) {
        const coreType = personalityType.enneagram.replace('Type ', '');
        const wingType = personalityType.enneagramWing.replace('Type ', '');
        formattedEnneagram = `${coreType}w${wingType}`;
      }
      
      const prompt = `
        请基于以下个人信息，分析我的性格优劣势，结合我的技能，为我生成一份人生发展和自我提高计划，需要尽可能详细：
        
        ${personalityType.mbti ? `我的MBTI类型是: ${personalityType.mbti}` : ''}
        ${formattedEnneagram ? `我的九型人格类型是: ${formattedEnneagram}` : ''}
        
        我的当前状况:
        ${currentSituation}
        
        我可以灵活调用的时间为:
        - 工作日: 每天${freeTimeAvailability.weekdayHours}小时
        - 周末: 每天${freeTimeAvailability.weekendHours}小时
        
        我想要短期实现的自我提高是:
        ${improvementGoals.filter(Boolean).map(goal => `- ${goal}`).join('\n')}
        
        我的人生目标大方向是:
        ${lifeObjectives}
      `;
      
      console.log("Sending request to DeepSeek API...");
      
      // Using fetch API to call DeepSeek API with updated parameters
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { 
              role: "system", 
              content: "你是一位专业的职业发展顾问，需要按照以下规则输出：\n1. 严格使用Markdown格式\n2. 采用分步骤的层级结构（STEP 1 → ▎子标题）\n3. 技术类建议需包含代码块示例\n4. 关键术语加粗+高亮（如**Ti-Ne**）\n5. 时间规划类内容用表格呈现" 
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 0.95,
          frequency_penalty: 0.5,
          presence_penalty: 0.2,
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
    const { personalityType, currentSituation, freeTimeAvailability, improvementGoals, lifeObjectives } = formData;
    
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
    } 
    
    let enneagramInsights = '';
    if (personalityType.enneagram && personalityType.enneagramWing) {
      const coreType = personalityType.enneagram.replace('Type ', '');
      const wingType = personalityType.enneagramWing.replace('Type ', '');
      
      if (coreType === '1') {
        enneagramInsights = `作为一个${coreType}w${wingType}型人格，您的完美主义倾向可以通过专注于进步而不是完美来实现有意义的提升。`;
      } else if (coreType === '2') {
        enneagramInsights = `作为一个${coreType}w${wingType}型人格，请确保在帮助他人的同时，也要平衡好自我关怀和个人发展。`;
      } else {
        enneagramInsights = `您的${coreType}w${wingType}九型人格表明了一种独特的成长方法，该方法平衡了您的核心动机与实际发展。`;
      }
    }
    
    const situationSummary = currentSituation.length > 200 
      ? `${currentSituation.substring(0, 200)}...` 
      : currentSituation;
    
    const timeFraming = freeTimeAvailability.weekdayHours >= 3 
      ? "您每天有足够的时间用于发展。" 
      : "由于工作日时间有限，请专注于高影响力、短时间的活动。";
    
    return `# 您的个性化成长计划

## STEP 1 → ▎个人资料摘要

${personalityType.mbti ? `**MBTI类型:** ${personalityType.mbti}` : ''}
${personalityType.enneagram && personalityType.enneagramWing ? `**九型人格:** ${personalityType.enneagram.replace('Type ', '')}w${personalityType.enneagramWing.replace('Type ', '')}` : ''}

**关键性格洞察:**
${personalityInsights}
${enneagramInsights}

**当前状况概述:**
${situationSummary}

## STEP 2 → ▎成长策略概述

根据您的个人资料，本计划专注于:
* ${improvementGoals.slice(0, 3).filter(Boolean).join('\n* ') || '个人发展与提升'}
* 充分利用您当前的技能和经验
* 在时间有限的情况下取得最大进展

## STEP 3 → ▎每周计划

${timeFraming} 您的最佳时间安排包括:

| 时间段 | 工作日 (${freeTimeAvailability.weekdayHours}小时/天) | 周末 (${freeTimeAvailability.weekendHours}小时/天) |
|--------|--------------------------|--------------------------|
| 早晨 | 20分钟: 晨间反思和计划回顾 | 1小时: 深度学习与提升 |
| 下午 | 30分钟: 专注技能发展 | 1小时: 项目实践与应用 |
| 晚上 | 45分钟: 主要目标进展 | 30分钟: 社交与网络建设 |
| 睡前 | 25分钟: 阅读与学习 | 30分钟: 周回顾与计划 |

## STEP 4 → ▎核心技能提升策略

以下是针对您所提到技能的具体提升策略：

\`\`\`python
# 示例：持续技能提升的代码实现
class SkillDevelopmentPlan:
    def __init__(self, current_skills, improvement_goals):
        self.current_skills = current_skills
        self.goals = improvement_goals
        self.progress = {}
    
    def set_daily_practice(self, skill, time_minutes):
        """为特定技能设置每日练习时间"""
        return f"每天投入{time_minutes}分钟提升{skill}技能"
    
    def track_progress(self, skill):
        """追踪特定技能的进步"""
        # 实际应用中可对接习惯追踪工具
        pass
\`\`\`

## STEP 5 → ▎日常实践建议

### 晨间例行公事
* 5分钟正念冥想
* 审视您的日常优先事项
* 为当天设定一个主要意图

### 晚间回顾
* 反思当天的成就
* 记录一个见解或学习
* 为明天做准备

## STEP 6 → ▎长期发展路径

您分享的人生目标关注于：
${lifeObjectives.slice(0, 150)}...

这个计划通过以下方式支持您的目标：
* 建立长期成功所需的基本技能
* 创建支持可持续成长的习惯
* 平衡即时改进与长期愿景

**关键成功因素:** 专注于一致性而不是完美，根据您的独特情况调整这个计划。
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
