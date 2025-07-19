const userService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem("minhaj-users") || "[]");
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const users = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
    return users.find(user => user.id === id);
  },

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const users = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem("minhaj-users", JSON.stringify(users));
      return users[userIndex];
    }
    throw new Error("User not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const users = JSON.parse(localStorage.getItem("minhaj-users") || "[]");
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem("minhaj-users", JSON.stringify(filteredUsers));
    return true;
  },

  async approveUser(id) {
    return this.update(id, { isApproved: true });
  },

  async rejectUser(id) {
    return this.delete(id);
  }
};

export default userService;