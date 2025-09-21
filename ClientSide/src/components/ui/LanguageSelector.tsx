import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage, availableLanguages, Language } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  showLabel?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  showLabel = false, 
  className = "" 
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangData = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        aria-label="Select Language"
      >
        <Languages className="w-4 h-4 text-gray-600" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currentLangData?.nativeName}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-80 overflow-y-auto"
            >
              <div className="py-2">
                {availableLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      currentLanguage === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{language.nativeName}</span>
                      <span className="text-sm text-gray-500">{language.name}</span>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
