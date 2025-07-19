import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import userService from "@/services/api/userService";
import transactionService from "@/services/api/transactionService";
import postService from "@/services/api/postService";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Transaction form
  const [selectedUser, setSelectedUser] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit");
  const [transactionDescription, setTransactionDescription] = useState("");

  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const isRTL = language === "ar" || language === "ur";

  useEffect(() => {
    const adminAuth = localStorage.getItem("minhaj-admin-auth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleLogin = () => {
    if (email === "admin@mtrad.com" && password === "MTRAD786@Admin") {
      setIsAuthenticated(true);
      localStorage.setItem("minhaj-admin-auth", "authenticated");
      loadAdminData();
      toast.success("Admin logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("minhaj-admin-auth");
    navigate("/");
  };

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [usersData, transactionsData, postsData] = await Promise.all([
        userService.getAll(),
        transactionService.getAll(),
        postService.getAll()
      ]);
      
      setUsers(usersData);
      setTransactions(transactionsData);
      setPosts(postsData);
      
      // Load messages
      const messagesData = JSON.parse(localStorage.getItem("minhaj-messages") || "[]");
      setMessages(messagesData);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      await userService.update(userId, { isApproved: true });
      loadAdminData();
      toast.success("User approved successfully");
    } catch (error) {
      toast.error("Failed to approve user");
    }
  };

  const rejectUser = async (userId) => {
    try {
      await userService.delete(userId);
      loadAdminData();
      toast.success("User rejected and removed");
    } catch (error) {
      toast.error("Failed to reject user");
    }
  };

  const addTransaction = async () => {
    if (!selectedUser || !transactionAmount || !transactionDescription) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await transactionService.addUserTransaction(
        selectedUser,
        parseFloat(transactionAmount),
        transactionType,
        transactionDescription
      );
      
      setSelectedUser("");
      setTransactionAmount("");
      setTransactionDescription("");
      loadAdminData();
      toast.success("Transaction added successfully");
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const toggleFeaturePost = async (postId) => {
    try {
      await postService.toggleFeature(postId);
      loadAdminData();
      toast.success("Post feature status updated");
    } catch (error) {
      toast.error("Failed to update post");
    }
  };

  const deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postService.delete(postId);
      loadAdminData();
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 ${isRTL ? 'rtl' : ''}`}>
        <Card className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Shield" size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
            <p className="text-gray-600">Restricted Area</p>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mtrad.com"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
            />
            
            <Button onClick={handleLogin} className="w-full">
              <ApperIcon name="LogIn" size={16} className="mr-2" />
              Access Admin Panel
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  const tabs = [
    { id: "users", label: "Users", icon: "Users", count: users.length },
    { id: "transactions", label: "Transactions", icon: "CreditCard", count: transactions.length },
    { id: "posts", label: "Posts", icon: "BookOpen", count: posts.length },
    { id: "messages", label: "Messages", icon: "Mail", count: messages.length }
  ];

  return (
    <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600">Platform management and oversight</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <ApperIcon name="LogOut" size={16} className="mr-2" />
          Logout
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-0 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <ApperIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">User Management</h2>
            
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Wallet</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">${user.walletBalance || 0}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.isApproved 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {!user.isApproved && (
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => approveUser(user.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => rejectUser(user.id)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Add Transaction */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none"
              >
                <option value="">Select User</option>
                {users.filter(u => u.isApproved).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (${user.walletBalance || 0})
                  </option>
                ))}
              </select>
              
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Amount"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none"
              />
              
              <input
                type="text"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                placeholder="Description"
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none"
              />
              
              <Button onClick={addTransaction}>Add</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "transactions" && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    return (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-800">{user?.name || 'Unknown User'}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'credit' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className={`py-3 px-4 font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{transaction.description}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === "posts" && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Posts Management</h2>
          
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No posts found</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const user = users.find(u => u.id === post.userId);
                return (
                  <div key={post.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="font-medium text-gray-800">{user?.name || 'Unknown User'}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                          {post.isFeatured && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        {post.ayahReference && (
                          <p className="text-sm text-primary-600 mb-2">📖 {post.ayahReference}</p>
                        )}
                        
                        <p className="text-gray-700 mb-2">{post.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{post.likes || 0} likes</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={post.isFeatured ? "primary" : "outline"}
                          onClick={() => toggleFeaturePost(post.id)}
                        >
                          <ApperIcon name="Star" size={14} className="mr-1" />
                          {post.isFeatured ? 'Unfeature' : 'Feature'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {activeTab === "messages" && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Messages</h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages found</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{message.userName}</p>
                      <p className="text-sm text-gray-600">{message.from}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-2">{message.subject}</h3>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;