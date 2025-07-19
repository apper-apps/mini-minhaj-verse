import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import UserProfile from "@/components/molecules/UserProfile";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showSecretPrompt, setShowSecretPrompt] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState("");
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const isRTL = language === "ar" || language === "ur";

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
    if (logoClickCount >= 4) {
      setShowSecretPrompt(true);
      setLogoClickCount(0);
    }
  };

  const handleSecretSubmit = () => {
    if (secretAnswer.toLowerCase() === "mtrad") {
      navigate("/admin");
      setShowSecretPrompt(false);
      setSecretAnswer("");
    } else {
      alert("Incorrect answer!");
      setSecretAnswer("");
    }
  };

  const navItems = [
    { path: "/dashboard", label: t('dashboard'), icon: "Home" },
    { path: "/whiteboard", label: t('whiteboard'), icon: "PenTool" },
    { path: "/quran-feed", label: t('quranFeed'), icon: "BookOpen" },
    { path: "/contact", label: t('contact'), icon: "MessageCircle" }
  ];

  return (
    <>
      <header className={`bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 ${isRTL ? 'rtl' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
<div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center">
                  <ApperIcon name="GraduationCap" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                    Minhaj Verse – Powered by Muhammad Tahir Raza (MTRAD)
                  </h1>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {user && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors duration-200"
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {user ? (
                <UserProfile />
              ) : (
                <Button size="sm" onClick={() => navigate("/login")}>
                  {t('login')}
                </Button>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <ApperIcon name={item.icon} size={20} className="text-primary-500" />
                  <span className="font-medium text-gray-700">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Secret Admin Prompt Modal */}
      {showSecretPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Secret Question</h3>
            <p className="text-gray-600 mb-4">What is the creator's abbreviation?</p>
            <input
              type="text"
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-4"
              placeholder="Enter answer..."
            />
            <div className="flex space-x-3">
              <Button onClick={handleSecretSubmit} className="flex-1">
                Submit
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSecretPrompt(false);
                  setSecretAnswer("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;