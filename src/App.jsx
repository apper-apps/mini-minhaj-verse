import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "@/hooks/useAuth.jsx";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Whiteboard from "@/components/pages/Whiteboard";
import Contact from "@/components/pages/Contact";
import QuranFeed from "@/components/pages/QuranFeed";
import Login from "@/components/pages/Login";
import AdminPanel from "@/components/pages/AdminPanel";
import Dashboard from "@/components/pages/Dashboard";
import { LanguageProvider } from "@/hooks/useLanguage";

import 'react-toastify/dist/ReactToastify.css'
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user && <Header />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
<Route
            path="/whiteboard"
            element={
              <ProtectedRoute>
                <Whiteboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quran-feed"
            element={
              <ProtectedRoute>
                <QuranFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>

      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;