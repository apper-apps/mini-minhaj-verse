const whiteboardService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem("minhaj-sessions") || "[]");
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const sessions = JSON.parse(localStorage.getItem("minhaj-sessions") || "[]");
    return sessions.find(session => session.id === id);
  },

  async create(session) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const sessions = JSON.parse(localStorage.getItem("minhaj-sessions") || "[]");
    const highestId = sessions.length > 0 ? Math.max(...sessions.map(s => parseInt(s.id))) : 0;
    
    const newSession = {
      ...session,
      id: (highestId + 1).toString(),
      startedAt: new Date().toISOString(),
      isActive: true,
      studentIds: []
    };
    
    sessions.push(newSession);
    localStorage.setItem("minhaj-sessions", JSON.stringify(sessions));
    return newSession;
  },

  async joinSession(sessionId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const sessions = JSON.parse(localStorage.getItem("minhaj-sessions") || "[]");
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex >= 0) {
      if (!sessions[sessionIndex].studentIds.includes(studentId)) {
        sessions[sessionIndex].studentIds.push(studentId);
        localStorage.setItem("minhaj-sessions", JSON.stringify(sessions));
      }
      return sessions[sessionIndex];
    }
    throw new Error("Session not found");
  },

  async endSession(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const sessions = JSON.parse(localStorage.getItem("minhaj-sessions") || "[]");
    const sessionIndex = sessions.findIndex(session => session.id === id);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].isActive = false;
      sessions[sessionIndex].endedAt = new Date().toISOString();
      localStorage.setItem("minhaj-sessions", JSON.stringify(sessions));
      return sessions[sessionIndex];
    }
    throw new Error("Session not found");
  }
};

export default whiteboardService;