import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.jsx";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const isRTL = language === "ar" || language === "ur";

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Simulate Google Sign-In flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGoogleUser = {
        id: Date.now().toString(),
        email: "user@example.com",
        name: "Test User",
        picture: "https://via.placeholder.com/150"
      };

      await login(mockGoogleUser);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4 ${isRTL ? 'rtl' : ''}`}>
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <LanguageSelector />
        </div>

        <Card variant="gradient" className="text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="GraduationCap" size={40} className="text-white" />
            </div>
<h1 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
              Minhaj Verse – Powered by Muhammad Tahir Raza (MTRAD)
            </h1>
            <p className="text-gray-600">{t('welcome')}</p>
          </div>

          {/* Islamic Pattern Decoration */}
          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <div className="w-3 h-3 bg-secondary-400 rounded-full"></div>
              <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
              <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
            </div>
          </div>

          {/* Language Selection Prompt */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">{t('selectLanguage')}</p>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            size="lg"
            className="w-full bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:bg-gray-50 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{t('signInGoogle')}</span>
              </>
            )}
          </Button>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" size={16} className="text-blue-500 mt-0.5" />
              <p className="text-sm text-blue-700 text-left">
                {t('approvalMessage')}
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-semibold text-primary-600">Muhammad Tahir Raza (MTRAD)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;