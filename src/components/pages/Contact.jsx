import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "react-toastify";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const isRTL = language === "ar" || language === "ur";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !subject.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store message in localStorage for admin to see
    const messages = JSON.parse(localStorage.getItem("minhaj-messages") || "[]");
    messages.push({
      id: Date.now().toString(),
      from: user?.email || "anonymous@example.com",
      userName: user?.name || "Anonymous",
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem("minhaj-messages", JSON.stringify(messages));
    
    setMessage("");
    setSubject("");
    setSending(false);
    toast.success(t('messageSent'));
  };

  return (
    <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('contact')}</h1>
          <p className="text-gray-600">Get in touch with us for any questions or feedback</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('enterMessage')}
                  rows={6}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={sending}
                className="w-full"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <ApperIcon name="Send" size={16} className="mr-2" />
                )}
                {t('sendMessage')}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card variant="colored">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Mail" size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">admin@mtrad.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Clock" size={20} className="text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Response Time</h3>
                    <p className="text-gray-600">24-48 hours</p>
                    <p className="text-sm text-gray-500">We aim to respond quickly</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="HelpCircle" size={20} className="text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Support</h3>
                    <p className="text-gray-600">Technical & Educational</p>
                    <p className="text-sm text-gray-500">Platform and learning support</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Questions?</h3>
              <div className="space-y-3">
                {[
                  "How do I join a whiteboard session?",
                  "What happens after I sign up?",
                  "How does the wallet system work?",
                  "Can I share Qur'an verses?"
                ].map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm text-gray-700"
                  >
                    <ApperIcon name="ChevronRight" size={14} className="inline mr-2" />
                    {question}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Info */}
        <Card className="mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Minhaj Verse</h3>
          <p className="text-gray-600 mb-4">Islamic Education Platform for Children</p>
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold text-primary-600">Muhammad Tahir Raza (MTRAD)</span>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Contact;