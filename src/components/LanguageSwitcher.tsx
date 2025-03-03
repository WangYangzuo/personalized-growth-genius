
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-1.5 rounded-full px-3 text-sm font-medium"
    >
      <Languages size={16} />
      <span>{language === 'en' ? '中文' : 'English'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
