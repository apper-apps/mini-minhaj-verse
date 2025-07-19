import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import postService from "@/services/api/postService";
import { toast } from "react-toastify";

const QuranFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState("");
  const [ayahReference, setAyahReference] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [filter, setFilter] = useState("all"); // all, featured, my

  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const isRTL = language === "ar" || language === "ur";

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const allPosts = await postService.getAll();
      setPosts(allPosts);
    } catch (error) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast.error("Please enter some content");
      return;
    }

    try {
      setIsPosting(true);
const post = await postService.create({
        userId: user.Id,
        userName: user.name,
        content: newPost,
        ayahReference: ayahReference || null
      });
      
      setPosts(prev => [post, ...prev]);
      setNewPost("");
      setAyahReference("");
      toast.success("Post shared successfully!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

const likePost = async (postId) => {
    try {
      const updatedPost = await postService.likePost(postId);
      setPosts(prev => prev.map(p => p.Id === postId ? updatedPost : p));
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const filteredPosts = posts.filter(post => {
if (filter === "featured") return post.isFeatured;
    if (filter === "my") return post.userId === user?.Id;
    return true;
  });

  if (loading) {
    return <Loading type="feed" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPosts} />;
  }

  return (
    <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('quranFeed')}</h1>
          <p className="text-gray-600 mt-1">Share and explore Islamic knowledge</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {[
            { key: "all", label: "All Posts", icon: "Globe" },
            { key: "featured", label: t('featuredPosts'), icon: "Star" },
            { key: "my", label: t('myPosts'), icon: "User" }
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.key)}
            >
              <ApperIcon name={filterOption.icon} size={16} className="mr-2" />
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Post Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('shareThought')}</h2>
            
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t('postPlaceholder')}
                className="w-full h-32 p-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none resize-none"
              />
              
              <input
                type="text"
                value={ayahReference}
                onChange={(e) => setAyahReference(e.target.value)}
                placeholder="Ayah reference (e.g., Al-Baqarah 2:255)"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
              />
              
              <Button
                onClick={createPost}
                disabled={isPosting || !newPost.trim()}
                className="w-full"
              >
                {isPosting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <ApperIcon name="Send" size={16} className="mr-2" />
                )}
                {t('sharePost')}
              </Button>
            </div>

            {/* Quick Islamic Phrases */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Phrases</h3>
              <div className="space-y-2">
                {[
                  "Bismillah",
                  "Alhamdulillah",
                  "SubhanAllah",
                  "Allahu Akbar",
                  "La hawla wa la quwwata illa billah"
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => setNewPost(prev => prev + " " + phrase)}
                    className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Posts Feed */}
        <div className="lg:col-span-2">
          {filteredPosts.length === 0 ? (
            <Empty
              icon="BookOpen"
              title="No posts found"
              description={
                filter === "my" 
                  ? "You haven't shared anything yet"
                  : filter === "featured"
                  ? "No featured posts available"
                  : "Be the first to share something!"
              }
              actionLabel={filter !== "all" ? "Share something" : undefined}
              onAction={filter !== "all" ? () => setFilter("all") : undefined}
            />
          ) : (
<div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.Id} className="hover:shadow-xl transition-shadow duration-300">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {post.userName?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{post.userName || "Anonymous"}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString()} • 
                          {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {post.isFeatured && (
                      <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        <ApperIcon name="Star" size={12} />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Ayah Reference */}
                  {post.ayahReference && (
                    <div className="mb-3 p-3 bg-primary-50 border-l-4 border-primary-400 rounded-r-xl">
                      <p className="text-sm font-medium text-primary-700">📖 {post.ayahReference}</p>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
<button
                        onClick={() => likePost(post.Id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Heart" size={16} />
                        <span className="text-sm">{post.likes || 0}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <ApperIcon name="MessageCircle" size={16} />
                        <span className="text-sm">Comment</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <ApperIcon name="Share" size={16} />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
{post.userId === user?.Id && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <ApperIcon name="MoreHorizontal" size={16} />
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranFeed;