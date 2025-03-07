import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from '@/context/FormContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ArrowLeft, ArrowRight, Check, ExternalLink,
  BrainCircuit, FileText, Clock, Target, Compass 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

// MBTI type options
const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// Enneagram type options with translations
const getEnneagramTypes = (language: string) => {
  if (language === 'en') {
    return [
      'Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5',
      'Type 6', 'Type 7', 'Type 8', 'Type 9'
    ];
  } else {
    return [
      'Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5',
      'Type 6', 'Type 7', 'Type 8', 'Type 9'
    ];
  }
};

// Enneagram wing options
const getEnneagramWings = (enneagramType: string): string[] => {
  if (!enneagramType) return [];
  
  const typeNumber = parseInt(enneagramType.replace('Type ', ''));
  if (isNaN(typeNumber)) return [];
  
  // Wings are adjacent types (wrapping from 9 to 1 and 1 to 9)
  const leftWing = typeNumber === 1 ? 9 : typeNumber - 1;
  const rightWing = typeNumber === 9 ? 1 : typeNumber + 1;
  
  return [`Type ${leftWing}`, `Type ${rightWing}`];
};

// Improvement goals options with translations
const getImprovementGoalOptions = (language: string) => {
  if (language === 'en') {
    return [
      'Improve productivity',
      'Enhance communication skills',
      'Develop leadership abilities',
      'Learn a new skill',
      'Achieve better work-life balance',
      'Boost creativity',
      'Manage stress more effectively',
      'Foster better relationships',
      'Advance career prospects',
      'Improve physical health',
      'Develop emotional intelligence',
      'Enhance problem-solving abilities'
    ];
  } else {
    return [
      '提高生产力',
      '增强沟通技巧',
      '发展领导能力',
      '学习新技能',
      '实现更好的工作生活平衡',
      '提升创造力',
      '更有效地管理压力',
      '培养更好的人际关系',
      '促进职业发展',
      '改善身体健康',
      '发展情商',
      '增强解决问题的能力'
    ];
  }
};

const QuestionnaireForm: React.FC = () => {
  const { 
    formData, 
    updateField, 
    nextStep, 
    prevStep, 
    goToStep 
  } = useFormContext();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showErrors, setShowErrors] = useState(false);

  // Labels for each step
  const steps = [
    { name: t('step.personality', '性格'), icon: <BrainCircuit size={18} /> },
    { name: t('step.situation', '现状'), icon: <FileText size={18} /> },
    { name: t('step.time', '时间'), icon: <Clock size={18} /> },
    { name: t('step.goals', '目标'), icon: <Target size={18} /> },
    { name: t('step.vision', '愿景'), icon: <Compass size={18} /> }
  ];

  // Form validation for each step
  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Personality type
        return formData.personalityType.mbti !== '' || 
               (formData.personalityType.enneagram !== '' && formData.personalityType.enneagramWing !== '');
      case 1: // Current situation
        return formData.currentSituation.trim() !== '';
      case 2: // Time availability
        return true; // Time has default values
      case 3: // Improvement goals
        return formData.improvementGoals.some(goal => goal !== '');
      case 4: // Life objectives
        return formData.lifeObjectives.trim() !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(formData.currentStep)) {
      if (formData.currentStep === steps.length - 1) {
        // Submit form
        navigate('/results');
      } else {
        nextStep();
      }
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(formData.currentStep)) {
      navigate('/results');
    } else {
      setShowErrors(true);
    }
  };

  // Form step animations
  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const enneagramTypes = getEnneagramTypes(language);
  const enneagramWings = getEnneagramWings(formData.personalityType.enneagram);
  const improvementGoalOptions = getImprovementGoalOptions(language);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => validateStep(formData.currentStep) && goToStep(index)}
              className={`flex flex-col items-center transition-all duration-300 p-2 rounded-lg
                ${index === formData.currentStep 
                  ? 'text-accent font-medium scale-110' 
                  : index < formData.currentStep 
                    ? 'text-gray-500 hover:text-accent' 
                    : 'text-gray-300 cursor-not-allowed'}`}
              disabled={index > formData.currentStep}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-1
                ${index === formData.currentStep 
                  ? 'bg-accent text-white' 
                  : index < formData.currentStep 
                    ? 'bg-gray-100 text-gray-500 border border-gray-200' 
                    : 'bg-gray-100 text-gray-300'}`}>
                {index < formData.currentStep ? <Check size={18} /> : step.icon}
              </div>
              <span className="text-sm hidden sm:block">{step.name}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${(formData.currentStep / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={formData.currentStep}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-soft border border-gray-100"
          >
            {/* Personality Type */}
            {formData.currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {t('personality.type', '您的性格类型')}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t('personality.description', '分享您的性格类型测试结果以获取量身定制的建议')}
                  </p>
                </div>

                {/* Test links */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                  <a 
                    href="https://www.16personalities.com/ch" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-accent hover:text-accent-dark transition-colors"
                  >
                    <span>{language === 'en' ? 'Take MBTI Test' : '进行MBTI测试'}</span>
                    <ExternalLink size={16} />
                  </a>
                  <a 
                    href="https://enneagram-personality.com/zh-Hans" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-accent hover:text-accent-dark transition-colors"
                  >
                    <span>{language === 'en' ? 'Take Enneagram Test' : '进行九型人格测试'}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mbti">{t('mbti.type', 'MBTI类型')}</Label>
                    <Select
                      value={formData.personalityType.mbti}
                      onValueChange={(value) => 
                        updateField('personalityType', 'mbti', value)
                      }
                    >
                      <SelectTrigger 
                        id="mbti"
                        className={`input-field ${showErrors && formData.personalityType.mbti === '' && formData.personalityType.enneagram === '' ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder={t('select.mbti', '选择您的MBTI类型')} />
                      </SelectTrigger>
                      <SelectContent>
                        {mbtiTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enneagram">{t('enneagram.type', '九型人格核心类型')}</Label>
                    <Select
                      value={formData.personalityType.enneagram}
                      onValueChange={(value) => {
                        // Reset wing when core type changes
                        updateField('personalityType', 'enneagram', value);
                        updateField('personalityType', 'enneagramWing', '');
                      }}
                    >
                      <SelectTrigger 
                        id="enneagram"
                        className={`input-field ${showErrors && formData.personalityType.mbti === '' && formData.personalityType.enneagram === '' ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder={t('select.enneagram', '选择您的九型人格核心类型')} />
                      </SelectTrigger>
                      <SelectContent>
                        {enneagramTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.personalityType.enneagram && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="enneagramWing">{t('enneagram.wing', '九型人格翼型')}</Label>
                      <Select
                        value={formData.personalityType.enneagramWing}
                        onValueChange={(value) => 
                          updateField('personalityType', 'enneagramWing', value)
                        }
                        disabled={!formData.personalityType.enneagram}
                      >
                        <SelectTrigger 
                          id="enneagramWing"
                          className={`input-field ${showErrors && formData.personalityType.enneagram !== '' && formData.personalityType.enneagramWing === '' ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder={t('select.enneagram.wing', '选择您的九型人格翼型')} />
                        </SelectTrigger>
                        <SelectContent>
                          {enneagramWings.map((wing) => (
                            <SelectItem key={wing} value={wing}>
                              {wing}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.personalityType.enneagram && formData.personalityType.enneagramWing && (
                        <p className="text-sm text-gray-500 mt-2">
                          {language === 'en' 
                            ? `Your Enneagram type with wing: ${formData.personalityType.enneagram.replace('Type ', '')}w${formData.personalityType.enneagramWing.replace('Type ', '')}`
                            : `您的九型人格带翼: ${formData.personalityType.enneagram.replace('Type ', '')}w${formData.personalityType.enneagramWing.replace('Type ', '')}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {showErrors && formData.personalityType.mbti === '' && 
                 (formData.personalityType.enneagram === '' || 
                  (formData.personalityType.enneagram !== '' && formData.personalityType.enneagramWing === '')) && (
                  <p className="text-red-500 text-sm mt-4">
                    {language === 'en' 
                      ? 'Please provide either MBTI type or complete Enneagram type with wing' 
                      : '请提供MBTI类型或完整的九型人格类型（含翼型）'}
                  </p>
                )}
              </div>
            )}

            {/* Current Situation */}
            {formData.currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {t('current.situation', '当前状况描述')}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t('situation.description', '描述您当前的情况，以帮助我们为您定制成长计划')}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="current-situation" className="text-base font-medium">
                    {t('describe.situation', '请描述您的当前状况')}
                  </Label>
                  <Textarea
                    id="current-situation"
                    value={formData.currentSituation}
                    onChange={(e) => updateField('currentSituation', '', e.target.value)}
                    placeholder={language === 'en' 
                      ? "Example: I am currently a bioinformatics engineer. I have skills in Python programming, data analysis. I am good at... I am not good at..."
                      : "例子：我目前是一个生物信息工程师，我掌握Python编程、数据分析等技能，我擅长...不擅长..."}
                    className={`min-h-[200px] input-field ${
                      showErrors && formData.currentSituation.trim() === '' ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formData.currentSituation.trim() === '' && (
                    <p className="text-red-500 text-sm">
                      {language === 'en' ? 'Please describe your current situation' : '请描述您的当前状况'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Time Availability */}
            {formData.currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {t('time.availability', '时间安排')}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t('time.description', '让我们了解您可以投入多少时间用于个人成长')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="weekday-hours" className="text-base font-medium">
                      {t('weekday.hours', '工作日时间（每天）')}
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="weekday-hours"
                        min={0.5}
                        max={5}
                        step={0.5}
                        value={[formData.freeTimeAvailability.weekdayHours]}
                        onValueChange={(value) => 
                          updateField('freeTimeAvailability', 'weekdayHours', value[0])
                        }
                        className="flex-grow"
                      />
                      <span className="text-gray-700 font-medium min-w-[40px]">
                        {formData.freeTimeAvailability.weekdayHours} {t('hours', '小时')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="weekend-hours" className="text-base font-medium">
                      {t('weekend.hours', '周末时间（每天）')}
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="weekend-hours"
                        min={0.5}
                        max={8}
                        step={0.5}
                        value={[formData.freeTimeAvailability.weekendHours]}
                        onValueChange={(value) => 
                          updateField('freeTimeAvailability', 'weekendHours', value[0])
                        }
                        className="flex-grow"
                      />
                      <span className="text-gray-700 font-medium min-w-[40px]">
                        {formData.freeTimeAvailability.weekendHours} {t('hours', '小时')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Goals */}
            {formData.currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {t('improvement.goals', '提升目标')}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t('goals.description', '选择您想要重点提升的领域')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`goal-${index}`} className="text-base font-medium">
                        {t('goal', '提升目标')} {index + 1}
                      </Label>
                      <Select
                        value={formData.improvementGoals[index] || ''}
                        onValueChange={(value) => {
                          const updatedGoals = [...formData.improvementGoals];
                          updatedGoals[index] = value;
                          updateField('improvementGoals', '', updatedGoals);
                        }}
                      >
                        <SelectTrigger
                          id={`goal-${index}`}
                          className={`input-field ${showErrors && formData.improvementGoals.every(goal => !goal) ? 'border-red-500' : ''}`}
                        >
                          <SelectValue placeholder={t('select.goal', '选择一个提升目标')} />
                        </SelectTrigger>
                        <SelectContent>
                          {improvementGoalOptions.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {showErrors && formData.improvementGoals.every(goal => !goal) && (
                  <p className="text-red-500 text-sm mt-2">
                    {language === 'en' ? 'Please select at least one improvement goal' : '请至少选择一个提升目标'}
                  </p>
                )}
              </div>
            )}

            {/* Life Objectives */}
            {formData.currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {t('life.objectives', '人生目标')}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {t('vision.description', '分享您的长期愿望和人生愿景')}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="life-objectives" className="text-base font-medium">
                    {t('life.goals.question', '您的主要人生目标和愿望是什么？')}
                  </Label>
                  <Textarea
                    id="life-objectives"
                    value={formData.lifeObjectives}
                    onChange={(e) => updateField('lifeObjectives', '', e.target.value)}
                    placeholder={t('life.goals.placeholder', '描述您的长期愿景、人生目标，以及成功对您意味着什么...')}
                    className={`min-h-[200px] input-field ${
                      showErrors && formData.lifeObjectives.trim() === '' ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formData.lifeObjectives.trim() === '' && (
                    <p className="text-red-500 text-sm">
                      {language === 'en' ? 'Please share your life goals' : '请分享您的人生目标'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={formData.currentStep === 0}
            className="flex items-center space-x-2 px-5"
          >
            <ArrowLeft size={16} />
            <span>{t('previous', '上一步')}</span>
          </Button>

          <Button
            type={formData.currentStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={handleNext}
            className="floating-button bg-accent hover:bg-accent/90 text-white flex items-center space-x-2 px-5"
          >
            <span>
              {formData.currentStep === steps.length - 1 
                ? t('generate.plan', '生成计划') 
                : t('next', '下一步')}
            </span>
            {formData.currentStep === steps.length - 1 ? (
              <Check size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
