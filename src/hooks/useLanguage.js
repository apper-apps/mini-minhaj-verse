import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
en: {
    appName: "Minhaj Verse – Powered by Muhammad Tahir Raza (MTRAD)",
    dashboard: "Dashboard",
    whiteboard: "Whiteboard",
    quranFeed: "Qur'an Feed",
    contact: "Contact",
    wallet: "Wallet",
    login: "Login",
    logout: "Logout",
    approved: "Approved",
    pending: "Pending Approval",
    errorOccurred: "Something went wrong",
    tryAgainLater: "Please try again later",
    tryAgain: "Try Again",
    noDataFound: "No data found",
    noDataDescription: "There's nothing to show here yet",
    getStarted: "Get Started",
    welcome: "Welcome to Minhaj Verse",
    signInGoogle: "Sign in with Google",
    selectLanguage: "Select your language",
    awaitingApproval: "Awaiting Approval",
    approvalMessage: "Your account is pending admin approval. Please wait for confirmation.",
    recentActivity: "Recent Activity",
    joinSession: "Join Session",
    createSession: "Create Session",
    shareThought: "Share a thought",
    featuredPosts: "Featured Posts",
    myPosts: "My Posts",
    likes: "likes",
    comments: "comments",
    postPlaceholder: "Share an ayah, reflection, or lesson...",
    sharePost: "Share Post",
    enterMessage: "Enter your message",
    sendMessage: "Send Message",
    messageSent: "Message sent successfully!",
    admin: "Admin Panel",
    users: "Users",
    transactions: "Transactions",
    posts: "Posts",
    approve: "Approve",
    reject: "Reject",
    feature: "Feature",
    delete: "Delete",
    credit: "Credit",
    debit: "Debit",
    amount: "Amount",
    description: "Description",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit"
  },
ur: {
    appName: "منہاج ورس – محمد طاہر رضا (MTRAD) کی جانب سے",
    dashboard: "ڈیش بورڈ",
    whiteboard: "وائٹ بورڈ",
    quranFeed: "قرآن فیڈ",
    contact: "رابطہ",
    wallet: "بٹوہ",
    login: "لاگ ان",
    logout: "لاگ آؤٹ",
    approved: "منظور شدہ",
    pending: "منظوری کا انتظار",
    errorOccurred: "کچھ غلط ہوا",
    tryAgainLater: "براہ کرم دوبارہ کوشش کریں",
    tryAgain: "دوبارہ کوشش کریں",
    noDataFound: "کوئی ڈیٹا نہیں ملا",
    noDataDescription: "ابھی یہاں دکھانے کے لیے کچھ نہیں ہے",
    getStarted: "شروعات کریں",
    welcome: "منہاج ورس میں خوش آمدید",
    signInGoogle: "گوگل کے ساتھ سائن ان کریں",
    selectLanguage: "اپنی زبان منتخب کریں",
    awaitingApproval: "منظوری کا انتظار",
    approvalMessage: "آپ کا اکاؤنٹ ایڈمن کی منظوری کا انتظار کر رہا ہے۔",
    recentActivity: "حالیہ سرگرمی",
    joinSession: "سیشن میں شامل ہوں",
    createSession: "سیشن بنائیں",
    shareThought: "خیال شیئر کریں",
    featuredPosts: "نمایاں پوسٹس",
    myPosts: "میری پوسٹس",
    likes: "پسند",
    comments: "تبصرے",
    postPlaceholder: "آیت، خیال، یا سبق شیئر کریں...",
    sharePost: "پوسٹ شیئر کریں",
    enterMessage: "اپنا پیغام درج کریں",
    sendMessage: "پیغام بھیجیں",
    messageSent: "پیغام کامیابی سے بھیجا گیا!",
    admin: "ایڈمن پینل",
    users: "صارفین",
    transactions: "لین دین",
    posts: "پوسٹس",
    approve: "منظور",
    reject: "مسترد",
    feature: "نمایاں",
    delete: "ڈیلیٹ",
    credit: "جمع",
    debit: "منفی",
    amount: "رقم",
    description: "تفصیل",
    submit: "جمع کریں",
    cancel: "منسوخ",
    save: "محفوظ",
    edit: "ترمیم"
  },
ar: {
    appName: "منهاج فيرس – مدعوم من محمد طاهر رضا (MTRAD)",
    dashboard: "لوحة القيادة",
    whiteboard: "السبورة البيضاء",
    quranFeed: "تغذية القرآن",
    contact: "اتصال",
    wallet: "المحفظة",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    approved: "معتمد",
    pending: "في انتظار الموافقة",
    errorOccurred: "حدث خطأ ما",
    tryAgainLater: "يرجى المحاولة مرة أخرى لاحقا",
    tryAgain: "حاول مرة أخرى",
    noDataFound: "لم يتم العثور على بيانات",
    noDataDescription: "لا يوجد شيء لإظهاره هنا بعد",
    getStarted: "ابدأ",
    welcome: "مرحبا بك في منهاج فيرس",
    signInGoogle: "تسجيل الدخول باستخدام جوجل",
    selectLanguage: "اختر لغتك",
    awaitingApproval: "في انتظار الموافقة",
    approvalMessage: "حسابك في انتظار موافقة المشرف. يرجى الانتظار للتأكيد.",
    recentActivity: "النشاط الأخير",
    joinSession: "انضم للجلسة",
    createSession: "إنشاء جلسة",
    shareThought: "شارك فكرة",
    featuredPosts: "المنشورات المميزة",
    myPosts: "منشوراتي",
    likes: "إعجابات",
    comments: "تعليقات",
    postPlaceholder: "شارك آية أو تأمل أو درس...",
    sharePost: "شارك المنشور",
    enterMessage: "أدخل رسالتك",
    sendMessage: "إرسال الرسالة",
    messageSent: "تم إرسال الرسالة بنجاح!",
    admin: "لوحة الإدارة",
    users: "المستخدمون",
    transactions: "المعاملات",
    posts: "المنشورات",
    approve: "موافقة",
    reject: "رفض",
    feature: "مميز",
    delete: "حذف",
    credit: "إيداع",
    debit: "سحب",
    amount: "المبلغ",
    description: "الوصف",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    edit: "تعديل"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("minhaj-language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("minhaj-language", language);
    document.documentElement.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
    document.documentElement.className = language === "ar" || language === "ur" ? "rtl" : "";
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};