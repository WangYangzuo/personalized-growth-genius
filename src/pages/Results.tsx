
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
        ? "As an introvert, you'll benefit from focused solo learning and reflection time. " 
        : "As an extrovert, you'll benefit from collaborative learning and social activities. ";
      
      personalityInsights += isThinking
        ? "Your thinking preference suggests a structured approach to problem-solving."
        : "Your feeling preference suggests a values-based approach to decision making.";
    } else if (personalityType.enneagram) {
      if (personalityType.enneagram.includes("Type 1")) {
        personalityInsights = "As a Type 1, your perfectionist tendencies can be channeled into meaningful improvement by focusing on progress rather than perfection.";
      } else if (personalityType.enneagram.includes("Type 2")) {
        personalityInsights = "As a Type 2, ensure you balance your helpfulness to others with self-care and personal development.";
      } else {
        personalityInsights = "Your Enneagram type suggests a unique approach to growth that balances your core motivations with practical development.";
      }
    }
    
    // Determine focus areas based on skills assessment
    const skillsArray = Object.entries(skillsAssessment);
    const lowestSkills = skillsArray.sort((a, b) => a[1] - b[1]).slice(0, 2);
    const highestSkills = skillsArray.sort((a, b) => b[1] - a[1]).slice(0, 2);
    
    // Create a time-based schedule
    const timeFraming = freeTimeAvailability.weekdayHours >= 3 
      ? "You have a good amount of daily time for development." 
      : "With limited weekday time, focus on high-impact, short activities.";
    
    // Create the plan content
    return `# Your Personalized Growth Plan

## Personal Profile Summary

${personalityType.mbti ? `**MBTI Type:** ${personalityType.mbti}` : ''}
${personalityType.enneagram ? `**Enneagram Type:** ${personalityType.enneagram}` : ''}

**Key Personality Insights:**
${personalityInsights}

## Growth Strategy Overview

Based on your profile, this plan focuses on:
* ${improvementGoals.slice(0, 3).join('\n* ')}
* Leveraging your strengths in ${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]} and ${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}
* Developing your ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]} and ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}

## Weekly Schedule

${timeFraming} Your optimal schedule includes:

### Weekdays (${freeTimeAvailability.weekdayHours} hours/day)
* 20 minutes: Morning reflection and plan review
* 30 minutes: Focused skill development in ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}
* 45 minutes: Progress on primary goal: ${improvementGoals[0] || 'Personal development'}
* 25 minutes: Reading or learning related to your interests

### Weekends (${freeTimeAvailability.weekendHours} hours/day)
* 1 hour: Deep work on ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]} skill development
* 1 hour: Project work related to ${improvementGoals[1] || 'secondary goals'}
* 30 minutes: Social or community activities aligned with your values
* 30 minutes: Review and plan for the upcoming week

## Daily Practices

### Morning Routine (Aligned with your ${freeTimeAvailability.preferredTimeOfDay} preference)
* 5 minutes mindfulness meditation
* Review your daily priorities
* Set one primary intention for the day

### Evening Review
* Reflect on daily accomplishments
* Note one insight or learning
* Prepare for tomorrow

## Monthly Focus Areas

### Month 1: Foundation Building
* Establish core daily habits
* Begin skill development in ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}
* Set baseline measurements for your primary goals

### Month 2: Skill Development
* Increase focus on ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[1]}
* Expand your network in areas related to ${improvementGoals[0] || 'your primary goal'}
* Begin a project that combines multiple skill areas

### Month 3: Integration and Momentum
* Connect separate skill areas in practical applications
* Evaluate progress and adjust approaches as needed
* Expand your comfort zone with new challenges

## Recommended Resources

### Books
* "Atomic Habits" by James Clear
* "Mindset" by Carol Dweck
* A specialized guide for ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]} development

### Courses
* Introductory course on ${lowestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}
* Advanced workshop in ${highestSkills.map(s => s[0].replace(/([A-Z])/g, ' $1').trim().replace('Skills', ''))[0]}

### Apps and Tools
* Habit tracking: Habitica or Loop Habit Tracker
* Learning: Coursera, LinkedIn Learning
* Reflection: Day One Journal or similar

## Personal Alignment with Life Objectives

Your shared life objectives focus on: 
${lifeObjectives.slice(0, 150)}...

This plan supports these objectives by:
* Building fundamental skills needed for long-term success
* Creating habits that support sustainable growth
* Balancing immediate improvement with long-term vision

## Progress Tracking

### Weekly Review Questions
1. What progress did I make on my priority goals?
2. Which habits were most effective?
3. What obstacles did I encounter and how can I address them?
4. What adjustments should I make for next week?

### Monthly Assessment
* Review measurable progress in key skill areas
* Evaluate habit consistency and effectiveness
* Adjust daily and weekly schedules as needed
* Celebrate wins and identify next growth edges

## Next Steps

1. Review this entire plan
2. Schedule your first week of activities
3. Prepare your tracking system
4. Begin with your morning routine tomorrow
5. Schedule your first weekly review

Remember that growth is not linear. Focus on consistency rather than perfection, and adjust this plan as you discover what works best for your unique situation.
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
            <span>Back to Questionnaire</span>
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
            Your Growth Plan
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            {loading 
              ? "We're creating your personalized growth plan based on your inputs..."
              : "Your AI-generated plan is ready! Download it or copy the content below."}
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
                  Return to Home
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
