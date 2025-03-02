import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormContext } from '@/context/FormContext';
import { 
  ArrowLeft, ArrowRight, Check, ChevronDown, 
  BrainCircuit, Dumbbell, Clock, Target, Compass 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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

// Enneagram type options
const enneagramTypes = [
  'Type 1 - The Perfectionist',
  'Type 2 - The Helper',
  'Type 3 - The Achiever',
  'Type 4 - The Individualist',
  'Type 5 - The Investigator',
  'Type 6 - The Loyalist',
  'Type 7 - The Enthusiast',
  'Type 8 - The Challenger',
  'Type 9 - The Peacemaker'
];

// Improvement goals options
const improvementGoalOptions = [
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

const QuestionnaireForm: React.FC = () => {
  const { 
    formData, 
    updateField, 
    nextStep, 
    prevStep, 
    goToStep 
  } = useFormContext();
  const navigate = useNavigate();
  const [showErrors, setShowErrors] = useState(false);

  // Labels for each step
  const steps = [
    { name: 'Personality', icon: <BrainCircuit size={18} /> },
    { name: 'Skills', icon: <Dumbbell size={18} /> },
    { name: 'Time', icon: <Clock size={18} /> },
    { name: 'Goals', icon: <Target size={18} /> },
    { name: 'Objectives', icon: <Compass size={18} /> }
  ];

  // Form validation for each step
  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Personality type
        return formData.personalityType.mbti !== '' || formData.personalityType.enneagram !== '';
      case 1: // Skills
        return true; // Skills have default values
      case 2: // Time availability
        return true; // Time has default values
      case 3: // Improvement goals
        return formData.improvementGoals.length > 0;
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
                  <h2 className="text-2xl font-semibold text-gray-800">Your Personality Type</h2>
                  <p className="text-gray-500 mt-1">
                    Share your personality type results to receive tailored recommendations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mbti">MBTI Type</Label>
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
                        <SelectValue placeholder="Select your MBTI type" />
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
                    <Label htmlFor="enneagram">Enneagram Type</Label>
                    <Select
                      value={formData.personalityType.enneagram}
                      onValueChange={(value) => 
                        updateField('personalityType', 'enneagram', value)
                      }
                    >
                      <SelectTrigger 
                        id="enneagram"
                        className={`input-field ${showErrors && formData.personalityType.mbti === '' && formData.personalityType.enneagram === '' ? 'border-red-500' : ''}`}
                      >
                        <SelectValue placeholder="Select your Enneagram type" />
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
                </div>

                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-medium text-gray-700">Jungian Cognitive Functions</h3>
                  <p className="text-sm text-gray-500">
                    Rate your strength in each cognitive function (0-10)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.keys(formData.personalityType.jungianFunctions).map((fn) => (
                      <div key={fn} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`function-${fn}`} className="text-sm font-medium">
                            {fn}
                          </Label>
                          <span className="text-sm text-gray-500">
                            {formData.personalityType.jungianFunctions[fn as keyof typeof formData.personalityType.jungianFunctions]}
                          </span>
                        </div>
                        <Slider
                          id={`function-${fn}`}
                          min={0}
                          max={10}
                          step={1}
                          value={[formData.personalityType.jungianFunctions[fn as keyof typeof formData.personalityType.jungianFunctions]]}
                          onValueChange={(value) => 
                            updateField('personalityType', `jungianFunctions.${fn}`, value[0])
                          }
                          className="py-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {showErrors && formData.personalityType.mbti === '' && formData.personalityType.enneagram === '' && (
                  <p className="text-red-500 text-sm mt-2">
                    Please provide at least one personality type (MBTI or Enneagram)
                  </p>
                )}
              </div>
            )}

            {/* Skills Assessment */}
            {formData.currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Skills Assessment</h2>
                  <p className="text-gray-500 mt-1">
                    Rate your current skill levels to help tailor your growth plan
                  </p>
                </div>

                <div className="space-y-8">
                  {Object.keys(formData.skillsAssessment).map((skill) => {
                    const skillName = skill.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).replace('Skills', '');
                    return (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`skill-${skill}`} className="text-base font-medium">
                            {skillName}
                          </Label>
                          <span className="text-sm text-gray-500">
                            {formData.skillsAssessment[skill as keyof typeof formData.skillsAssessment]}
                          </span>
                        </div>
                        <Slider
                          id={`skill-${skill}`}
                          min={1}
                          max={10}
                          step={1}
                          value={[formData.skillsAssessment[skill as keyof typeof formData.skillsAssessment]]}
                          onValueChange={(value) => 
                            updateField('skillsAssessment', skill, value[0])
                          }
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Time Availability */}
            {formData.currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Time Availability</h2>
                  <p className="text-gray-500 mt-1">
                    Let us know how much time you can dedicate to personal growth
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label htmlFor="weekday-hours" className="text-base font-medium">
                      Weekday Hours (per day)
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
                        {formData.freeTimeAvailability.weekdayHours} hrs
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="weekend-hours" className="text-base font-medium">
                      Weekend Hours (per day)
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
                        {formData.freeTimeAvailability.weekendHours} hrs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Label htmlFor="preferred-time" className="text-base font-medium">
                    Preferred Time of Day
                  </Label>
                  <Select
                    value={formData.freeTimeAvailability.preferredTimeOfDay}
                    onValueChange={(value: any) => 
                      updateField('freeTimeAvailability', 'preferredTimeOfDay', value)
                    }
                  >
                    <SelectTrigger id="preferred-time" className="input-field">
                      <SelectValue placeholder="Select preferred time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (5am - 11am)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (11am - 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm - 10pm)</SelectItem>
                      <SelectItem value="night">Night (10pm - 5am)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Improvement Goals */}
            {formData.currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Improvement Goals</h2>
                  <p className="text-gray-500 mt-1">
                    Select the areas you'd like to focus on improving
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {improvementGoalOptions.map((goal) => (
                    <div
                      key={goal}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer
                        ${formData.improvementGoals.includes(goal) 
                          ? 'bg-accent/10 border border-accent/20' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                      onClick={() => {
                        const updatedGoals = formData.improvementGoals.includes(goal)
                          ? formData.improvementGoals.filter(g => g !== goal)
                          : [...formData.improvementGoals, goal];
                        updateField('improvementGoals', '', updatedGoals);
                      }}
                    >
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={formData.improvementGoals.includes(goal)}
                      />
                      <label
                        htmlFor={`goal-${goal}`}
                        className="text-sm leading-tight cursor-pointer flex-1"
                      >
                        {goal}
                      </label>
                    </div>
                  ))}
                </div>

                {showErrors && formData.improvementGoals.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select at least one improvement goal
                  </p>
                )}
              </div>
            )}

            {/* Life Objectives */}
            {formData.currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Life Objectives</h2>
                  <p className="text-gray-500 mt-1">
                    Share your long-term aspirations and life vision
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="life-objectives" className="text-base font-medium">
                    What are your main life objectives and aspirations?
                  </Label>
                  <Textarea
                    id="life-objectives"
                    value={formData.lifeObjectives}
                    onChange={(e) => updateField('lifeObjectives', '', e.target.value)}
                    placeholder="Describe your long-term vision, life goals, and what success means to you..."
                    className={`min-h-[200px] input-field ${
                      showErrors && formData.lifeObjectives.trim() === '' ? 'border-red-500' : ''
                    }`}
                  />
                  {showErrors && formData.lifeObjectives.trim() === '' && (
                    <p className="text-red-500 text-sm">
                      Please share your life objectives
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
            <span>Previous</span>
          </Button>

          <Button
            type={formData.currentStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={handleNext}
            className="floating-button bg-accent hover:bg-accent/90 text-white flex items-center space-x-2 px-5"
          >
            <span>{formData.currentStep === steps.length - 1 ? 'Generate Plan' : 'Next'}</span>
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
