// Mock posts data with Islamic content
const mockPosts = [
  {
    Id: 1,
    userId: 1,
    userName: "Ahmed Hassan",
    content: "Alhamdulillah! Just finished teaching about the 99 names of Allah to my students. Their enthusiasm for learning is truly inspiring. May Allah bless their journey of knowledge.",
    ayahReference: "Al-A'raf 7:180",
    timestamp: "2024-01-20T10:30:00Z",
    likes: 12,
    isFeatured: true,
    comments: []
  },
  {
    Id: 2,
    userId: 2,
    userName: "Fatima Ali",
    content: "SubhanAllah, today I learned about the importance of seeking knowledge in Islam. The Prophet (PBUH) said: 'Seek knowledge from the cradle to the grave.' This platform is helping me do exactly that!",
    ayahReference: null,
    timestamp: "2024-01-20T09:15:00Z",
    likes: 8,
    isFeatured: false,
    comments: []
  },
  {
    Id: 3,
    userId: 4,
    userName: "Aisha Mohammed",
    content: "Bismillah! Starting a new session on Arabic calligraphy today. Learning the beautiful art of writing the Quran is both a spiritual and artistic journey. Who would like to join?",
    ayahReference: "Al-Qalam 68:1",
    timestamp: "2024-01-20T08:45:00Z",
    likes: 15,
    isFeatured: true,
    comments: []
  },
  {
    Id: 4,
    userId: 5,
    userName: "Yusuf Rahman",
    content: "Allahu Akbar! Memorized another page of the Quran today. The beauty of the words and their meanings continue to amaze me. May Allah make it easy for all students of the Quran.",
    ayahReference: "Al-Baqarah 2:185",
    timestamp: "2024-01-19T16:20:00Z",
    likes: 6,
    isFeatured: false,
    comments: []
  },
  {
    Id: 5,
    userId: 1,
    userName: "Ahmed Hassan",
    content: "La hawla wa la quwwata illa billah. Reflecting on the wisdom in every verse of the Quran. Each teaching session reminds me how much there is still to learn and share.",
    ayahReference: "Al-Kahf 18:39",
    timestamp: "2024-01-19T14:10:00Z",
    likes: 9,
    isFeatured: false,
    comments: []
  }
];

// Initialize posts in localStorage
const initializePosts = () => {
  const stored = localStorage.getItem('minhaj-posts');
  if (!stored) {
    localStorage.setItem('minhaj-posts', JSON.stringify(mockPosts));
    return mockPosts;
  }
  return JSON.parse(stored);
};

// Get next available ID
const getNextId = (posts) => {
  const maxId = posts.reduce((max, post) => Math.max(max, post.Id), 0);
  return maxId + 1;
};

// Simulate API delay
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const postService = {
  async getAll() {
    await delay();
    const posts = initializePosts();
    // Sort by timestamp descending (newest first)
    return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid post ID');
    }
    
    await delay();
    const posts = initializePosts();
    const post = posts.find(p => p.Id === id);
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    return { ...post };
  },

  async create(postData) {
    await delay();
    const posts = initializePosts();
    
    // Auto-generate ID, ignore any provided Id
    const newPost = {
      ...postData,
      Id: getNextId(posts),
      timestamp: new Date().toISOString(),
      likes: 0,
      isFeatured: false,
      comments: []
    };
    
    const updatedPosts = [...posts, newPost];
    localStorage.setItem('minhaj-posts', JSON.stringify(updatedPosts));
    
    return { ...newPost };
  },

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid post ID');
    }
    
    await delay();
    const posts = initializePosts();
    const postIndex = posts.findIndex(p => p.Id === id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    // Prevent ID updates
    const { Id, ...allowedUpdates } = updateData;
    
    const updatedPost = {
      ...posts[postIndex],
      ...allowedUpdates
    };
    
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    localStorage.setItem('minhaj-posts', JSON.stringify(updatedPosts));
    
    return { ...updatedPost };
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid post ID');
    }
    
    await delay();
    const posts = initializePosts();
    const postExists = posts.some(p => p.Id === id);
    
    if (!postExists) {
      throw new Error('Post not found');
    }
    
    const updatedPosts = posts.filter(p => p.Id !== id);
    localStorage.setItem('minhaj-posts', JSON.stringify(updatedPosts));
    
    return { success: true };
  },

  async likePost(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid post ID');
    }
    
    await delay();
    const posts = initializePosts();
    const postIndex = posts.findIndex(p => p.Id === id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = {
      ...posts[postIndex],
      likes: (posts[postIndex].likes || 0) + 1
    };
    
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    localStorage.setItem('minhaj-posts', JSON.stringify(updatedPosts));
    
    return { ...updatedPost };
  },

  async toggleFeature(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid post ID');
    }
    
    await delay();
    const posts = initializePosts();
    const postIndex = posts.findIndex(p => p.Id === id);
    
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = {
      ...posts[postIndex],
      isFeatured: !posts[postIndex].isFeatured
    };
    
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    localStorage.setItem('minhaj-posts', JSON.stringify(updatedPosts));
    
    return { ...updatedPost };
  },

  async getFeaturedPosts() {
    const posts = await this.getAll();
    return posts.filter(p => p.isFeatured);
  },

  async getPostsByUser(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    const posts = await this.getAll();
    return posts.filter(p => p.userId === userId);
  },

  async searchPosts(query) {
    if (!query || query.trim().length === 0) {
      return await this.getAll();
    }
    
    const posts = await this.getAll();
    const searchTerm = query.toLowerCase().trim();
    
    return posts.filter(p => 
      p.content.toLowerCase().includes(searchTerm) ||
      (p.ayahReference && p.ayahReference.toLowerCase().includes(searchTerm)) ||
      p.userName.toLowerCase().includes(searchTerm)
    );
  }
};

export default postService;