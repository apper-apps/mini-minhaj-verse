// Mock user data with Islamic education context
const mockUsers = [
  {
    Id: 1,
    email: "ahmed.hassan@email.com",
    name: "Ahmed Hassan",
    picture: "https://via.placeholder.com/150",
    role: "teacher",
    isApproved: true,
    walletBalance: 250.75,
    joinedAt: "2024-01-15T10:30:00Z",
    lastActive: "2024-01-20T15:45:00Z"
  },
  {
    Id: 2,
    email: "fatima.ali@email.com", 
    name: "Fatima Ali",
    picture: "https://via.placeholder.com/150",
    role: "student",
    isApproved: true,
    walletBalance: 125.50,
    joinedAt: "2024-01-16T09:15:00Z",
    lastActive: "2024-01-20T14:20:00Z"
  },
  {
    Id: 3,
    email: "omar.ibrahim@email.com",
    name: "Omar Ibrahim", 
    picture: "https://via.placeholder.com/150",
    role: "student",
    isApproved: false,
    walletBalance: 0,
    joinedAt: "2024-01-20T11:00:00Z",
    lastActive: "2024-01-20T11:00:00Z"
  },
  {
    Id: 4,
    email: "aisha.mohammed@email.com",
    name: "Aisha Mohammed",
    picture: "https://via.placeholder.com/150", 
    role: "teacher",
    isApproved: true,
    walletBalance: 320.25,
    joinedAt: "2024-01-10T08:45:00Z",
    lastActive: "2024-01-20T16:10:00Z"
  },
  {
    Id: 5,
    email: "yusuf.rahman@email.com",
    name: "Yusuf Rahman",
    picture: "https://via.placeholder.com/150",
    role: "student", 
    isApproved: true,
    walletBalance: 85.00,
    joinedAt: "2024-01-18T14:30:00Z",
    lastActive: "2024-01-20T13:55:00Z"
  }
];

// Store users in localStorage on first load
const initializeUsers = () => {
  const stored = localStorage.getItem('minhaj-users');
  if (!stored) {
    localStorage.setItem('minhaj-users', JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(stored);
};

// Get next available ID
const getNextId = (users) => {
  const maxId = users.reduce((max, user) => Math.max(max, user.Id), 0);
  return maxId + 1;
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getAll() {
    await delay();
    const users = initializeUsers();
    return [...users];
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    await delay();
    const users = initializeUsers();
    const user = users.find(u => u.Id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { ...user };
  },

  async create(userData) {
    await delay();
    const users = initializeUsers();
    
    // Auto-generate ID, ignore any provided Id
    const newUser = {
      ...userData,
      Id: getNextId(users),
      isApproved: false,
      walletBalance: 0,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      role: userData.role || 'student'
    };
    
    const updatedUsers = [...users, newUser];
    localStorage.setItem('minhaj-users', JSON.stringify(updatedUsers));
    
    return { ...newUser };
  },

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    await delay();
    const users = initializeUsers();
    const userIndex = users.findIndex(u => u.Id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Prevent ID updates
    const { Id, ...allowedUpdates } = updateData;
    
    const updatedUser = {
      ...users[userIndex],
      ...allowedUpdates,
      lastActive: new Date().toISOString()
    };
    
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    localStorage.setItem('minhaj-users', JSON.stringify(updatedUsers));
    
    return { ...updatedUser };
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    await delay();
    const users = initializeUsers();
    const userExists = users.some(u => u.Id === id);
    
    if (!userExists) {
      throw new Error('User not found');
    }
    
    const updatedUsers = users.filter(u => u.Id !== id);
    localStorage.setItem('minhaj-users', JSON.stringify(updatedUsers));
    
    return { success: true };
  },

  async updateWalletBalance(id, newBalance) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid user ID');
    }
    
    if (typeof newBalance !== 'number' || newBalance < 0) {
      throw new Error('Invalid wallet balance');
    }
    
    return await this.update(id, { walletBalance: newBalance });
  },

  async findByEmail(email) {
    await delay();
    const users = initializeUsers();
    const user = users.find(u => u.email === email);
    return user ? { ...user } : null;
  },

  async approveUser(id) {
    return await this.update(id, { isApproved: true });
  },

  async getApprovedUsers() {
    const users = await this.getAll();
    return users.filter(u => u.isApproved);
  },

  async getPendingUsers() {
    const users = await this.getAll();
    return users.filter(u => !u.isApproved);
  }
};

export default userService;