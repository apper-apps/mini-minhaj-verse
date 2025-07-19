import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center space-x-3 bg-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <ApperIcon name="ChevronDown" size={14} className="text-gray-400" />
      </button>

      <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 min-w-[180px]">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${user.isApproved ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-gray-600">
              {user.isApproved ? t('approved') : t('pending')}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2 text-red-600"
        >
          <ApperIcon name="LogOut" size={16} />
          <span className="text-sm">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;