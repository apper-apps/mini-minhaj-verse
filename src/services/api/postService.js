const postService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    return posts.find(post => post.id === id);
  },

  async create(post) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    const highestId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) : 0;
    
    const newPost = {
      ...post,
      id: (highestId + 1).toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      isFeatured: false
    };
    
    posts.unshift(newPost);
    localStorage.setItem("minhaj-posts", JSON.stringify(posts));
    return newPost;
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex >= 0) {
      posts[postIndex] = { ...posts[postIndex], ...updates };
      localStorage.setItem("minhaj-posts", JSON.stringify(posts));
      return posts[postIndex];
    }
    throw new Error("Post not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem("minhaj-posts", JSON.stringify(filteredPosts));
    return true;
  },

  async likePost(id) {
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex >= 0) {
      posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
      localStorage.setItem("minhaj-posts", JSON.stringify(posts));
      return posts[postIndex];
    }
    throw new Error("Post not found");
  },

  async toggleFeature(id) {
    const posts = JSON.parse(localStorage.getItem("minhaj-posts") || "[]");
    const postIndex = posts.findIndex(post => post.id === id);
    
    if (postIndex >= 0) {
      posts[postIndex].isFeatured = !posts[postIndex].isFeatured;
      localStorage.setItem("minhaj-posts", JSON.stringify(posts));
      return posts[postIndex];
    }
    throw new Error("Post not found");
  }
};

export default postService;