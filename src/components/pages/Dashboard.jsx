import React, { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import WalletWidget from "@/components/molecules/WalletWidget";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import postService from "@/services/api/postService";
import whiteboardService from "@/services/api/whiteboardService";
import userService from "@/services/api/userService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, posts: 0, sessions: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  
  const { user } = useAuth();
  const { transactions } = useWallet();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const isRTL = language === "ar" || language === "ur";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [users, posts, sessions] = await Promise.all([
        userService.getAll(),
        postService.getAll(),
        whiteboardService.getAll()
      ]);

      setStats({
        users: users.length,
        posts: posts.length,
        sessions: sessions.filter(s => s.isActive).length
      });

      setRecentPosts(posts.slice(0, 3));
      setActiveSessions(sessions.filter(s => s.isActive).slice(0, 3));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isApproved) {
    return (
      <div className={`p-6 ${isRTL ? 'rtl' : ''}`}>
        <Card className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Clock" size={40} className="text-yellow-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('awaitingApproval')}</h2>
          <p className="text-gray-600 max-w-md mx-auto">{t('approvalMessage')}</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <Loading type="dashboard" />;
  }

  return (
    <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : ''}`}>
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t('welcome')}, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Ready to learn and grow today?</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => navigate("/whiteboard")} variant="secondary">
            <ApperIcon name="PenTool" size={16} className="mr-2" />
            {user.role === "teacher" ? t('createSession') : t('joinSession')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <WalletWidget />
        
        <Card variant="gradient" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Community</h3>
          <div className="text-2xl font-bold text-primary-600">{stats.users}</div>
          <p className="text-sm text-gray-600">Active learners</p>
        </Card>

        <Card variant="gradient" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('posts')}</h3>
          <div className="text-2xl font-bold text-secondary-600">{stats.posts}</div>
          <p className="text-sm text-gray-600">Shared thoughts</p>
        </Card>

        <Card variant="gradient" className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="Video" size={24} className="text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Live Sessions</h3>
          <div className="text-2xl font-bold text-accent-600">{stats.sessions}</div>
          <p className="text-sm text-gray-600">Active now</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('recentActivity')}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/quran-feed")}>
              View all
            </Button>
          </div>

          {recentPosts.length === 0 ? (
            <Empty 
              icon="MessageCircle"
              title="No recent posts"
              description="Be the first to share something!"
              actionLabel="Share a thought"
              onAction={() => navigate("/quran-feed")}
/>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.Id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm">{post.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center text-xs text-gray-500">
                          <ApperIcon name="Heart" size={12} className="mr-1" />
                          {post.likes} {t('likes')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Sessions or Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {user.role === "teacher" ? "Your Sessions" : "Wallet Activity"}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(user.role === "teacher" ? "/whiteboard" : "/dashboard")}
            >
              View all
            </Button>
          </div>

          {user.role === "teacher" ? (
            activeSessions.length === 0 ? (
              <Empty 
                icon="Video"
                title="No active sessions"
                description="Start a new whiteboard session"
                actionLabel="Create Session"
                onAction={() => navigate("/whiteboard")}
              />
            ) : (
<div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.Id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{session.title}</h3>
                        <p className="text-sm text-gray-600">
                          {session.studentIds.length} students joined
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            transactions.length === 0 ? (
              <Empty 
                icon="CreditCard"
                title="No transactions yet"
                description="Your wallet activity will appear here"
              />
            ) : (
<div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.Id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;