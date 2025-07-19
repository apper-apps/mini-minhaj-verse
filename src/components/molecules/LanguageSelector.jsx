import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { useLanguage } from "@/hooks/useLanguage";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "ar", name: "العربية", flag: "🇸🇦" }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 bg-white rounded-xl px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200">
        <ApperIcon name="Globe" size={16} className="text-primary-500" />
        <span className="text-sm font-medium text-gray-700">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
        <ApperIcon name="ChevronDown" size={14} className="text-gray-400" />
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 min-w-[120px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2"
          >
            <span>{lang.flag}</span>
            <span className="text-sm font-medium text-gray-700">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;