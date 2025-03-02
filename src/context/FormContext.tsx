
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for our form state
export type PersonalityType = {
  mbti: string;
  enneagram: string;
  jungianFunctions: {
    Se: number;
    Si: number;
    Ne: number;
    Ni: number;
    Te: number;
    Ti: number;
    Fe: number;
    Fi: number;
  };
};

export type SkillsAssessment = {
  technicalSkills: number;
  creativeSkills: number;
  communicationSkills: number;
  analyticalSkills: number;
  organizationalSkills: number;
  interpersonalSkills: number;
  leadershipSkills: number;
  adaptabilitySkills: number;
};

export type FormData = {
  personalityType: PersonalityType;
  skillsAssessment: SkillsAssessment;
  freeTimeAvailability: {
    weekdayHours: number;
    weekendHours: number;
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  improvementGoals: string[];
  lifeObjectives: string;
  currentStep: number;
};

// Initial state values
const initialFormData: FormData = {
  personalityType: {
    mbti: '',
    enneagram: '',
    jungianFunctions: {
      Se: 0,
      Si: 0,
      Ne: 0,
      Ni: 0,
      Te: 0,
      Ti: 0,
      Fe: 0,
      Fi: 0,
    },
  },
  skillsAssessment: {
    technicalSkills: 5,
    creativeSkills: 5,
    communicationSkills: 5,
    analyticalSkills: 5,
    organizationalSkills: 5,
    interpersonalSkills: 5,
    leadershipSkills: 5,
    adaptabilitySkills: 5,
  },
  freeTimeAvailability: {
    weekdayHours: 2,
    weekendHours: 4,
    preferredTimeOfDay: 'morning',
  },
  improvementGoals: [],
  lifeObjectives: '',
  currentStep: 0,
};

// Create the context
type FormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateField: (
    section: keyof FormData,
    field: string,
    value: any
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

// Context provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev) => {
      // Handle nested fields
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        
        // Handle the nested update safely with type checking
        const sectionObj = prev[section];
        if (typeof sectionObj === 'object' && sectionObj !== null) {
          const parentObj = sectionObj[parentField as keyof typeof sectionObj];
          if (typeof parentObj === 'object' && parentObj !== null) {
            // Create a new object for the parent field
            const updatedParentObj = {
              ...(typeof parentObj === 'object' && parentObj !== null ? parentObj : {}),
              [childField]: value
            };
            
            // Update the section with the new parent object
            return {
              ...prev,
              [section]: {
                ...(typeof sectionObj === 'object' && sectionObj !== null ? sectionObj : {}),
                [parentField]: updatedParentObj
              }
            };
          }
        }
        
        return prev;
      }
      
      // Handle regular fields - create a properly typed update
      if (section === 'improvementGoals' || section === 'lifeObjectives' || section === 'currentStep') {
        // These fields don't have subfields that need updating
        return {
          ...prev,
          [section]: value
        };
      } else {
        // For object-type sections that have subfields
        const sectionObj = prev[section];
        if (typeof sectionObj === 'object' && sectionObj !== null) {
          return {
            ...prev,
            [section]: {
              ...(typeof sectionObj === 'object' && sectionObj !== null ? sectionObj : {}),
              [field]: value
            }
          };
        }
        
        return prev;
      }
    });
  };

  const nextStep = () => {
    setFormData((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  const prevStep = () => {
    setFormData((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  const goToStep = (step: number) => {
    setFormData((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        updateField,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
