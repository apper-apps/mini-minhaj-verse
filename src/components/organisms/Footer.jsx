import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { language } = useLanguage();
  const isRTL = language === "ar" || language === "ur";

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 py-6 ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          Powered by <span className="font-semibold text-primary-600">Muhammad Tahir Raza (MTRAD)</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;