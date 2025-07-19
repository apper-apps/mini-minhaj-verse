// Mock whiteboard session data
const mockSessions = [
  {
    Id: 1,
    title: "Arabic Alphabet Basics",
    teacherId: 1,
    teacherName: "Ahmed Hassan",
    studentIds: [2, 5],
    studentNames: ["Fatima Ali", "Yusuf Rahman"],
    isActive: true,
    createdAt: "2024-01-20T09:00:00Z",
    endedAt: null,
    canvasData: null,
    maxStudents: 10
  },
  {
    Id: 2,
    title: "Quran Recitation Practice",
    teacherId: 4,
    teacherName: "Aisha Mohammed",
    studentIds: [2],
    studentNames: ["Fatima Ali"],
    isActive: true,
    createdAt: "2024-01-20T10:30:00Z",
    endedAt: null,
    canvasData: null,
    maxStudents: 8
  },
  {
    Id: 3,
    title: "Islamic History Timeline",
    teacherId: 1,
    teacherName: "Ahmed Hassan",
    studentIds: [2, 5],
    studentNames: ["Fatima Ali", "Yusuf Rahman"],
    isActive: false,
    createdAt: "2024-01-19T14:00:00Z",
    endedAt: "2024-01-19T15:30:00Z",
    canvasData: null,
    maxStudents: 12
  },
  {
    Id: 4,
    title: "Dua Memorization Session",
    teacherId: 4,
    teacherName: "Aisha Mohammed",
    studentIds: [5],
    studentNames: ["Yusuf Rahman"],
    isActive: false,
    createdAt: "2024-01-18T16:00:00Z",
    endedAt: "2024-01-18T17:00:00Z",
    canvasData: null,
    maxStudents: 6
  }
];

// Initialize sessions in localStorage
const initializeSessions = () => {
  const stored = localStorage.getItem('minhaj-whiteboard-sessions');
  if (!stored) {
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(mockSessions));
    return mockSessions;
  }
  return JSON.parse(stored);
};

// Get next available ID
const getNextId = (sessions) => {
  const maxId = sessions.reduce((max, session) => Math.max(max, session.Id), 0);
  return maxId + 1;
};

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const whiteboardService = {
  async getAll() {
    await delay();
    const sessions = initializeSessions();
    // Sort by creation time descending (newest first)
    return [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid session ID');
    }
    
    await delay();
    const sessions = initializeSessions();
    const session = sessions.find(s => s.Id === id);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    return { ...session };
  },

  async create(sessionData) {
    await delay();
    const sessions = initializeSessions();
    
    // Auto-generate ID, ignore any provided Id
    const newSession = {
      ...sessionData,
      Id: getNextId(sessions),
      studentIds: [],
      studentNames: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      endedAt: null,
      canvasData: null,
      maxStudents: sessionData.maxStudents || 10
    };
    
    const updatedSessions = [...sessions, newSession];
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(updatedSessions));
    
    return { ...newSession };
  },

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid session ID');
    }
    
    await delay();
    const sessions = initializeSessions();
    const sessionIndex = sessions.findIndex(s => s.Id === id);
    
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    // Prevent ID updates
    const { Id, ...allowedUpdates } = updateData;
    
    const updatedSession = {
      ...sessions[sessionIndex],
      ...allowedUpdates
    };
    
    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(updatedSessions));
    
    return { ...updatedSession };
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid session ID');
    }
    
    await delay();
    const sessions = initializeSessions();
    const sessionExists = sessions.some(s => s.Id === id);
    
    if (!sessionExists) {
      throw new Error('Session not found');
    }
    
    const updatedSessions = sessions.filter(s => s.Id !== id);
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(updatedSessions));
    
    return { success: true };
  },

  async joinSession(sessionId, userId) {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new Error('Invalid session ID');
    }
    
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    await delay();
    const sessions = initializeSessions();
    const sessionIndex = sessions.findIndex(s => s.Id === sessionId);
    
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    const session = sessions[sessionIndex];
    
    if (!session.isActive) {
      throw new Error('Session is not active');
    }
    
    if (session.teacherId === userId) {
      // Teacher joining their own session
      return { ...session };
    }
    
    if (session.studentIds.includes(userId)) {
      // User already in session
      return { ...session };
    }
    
    if (session.studentIds.length >= session.maxStudents) {
      throw new Error('Session is full');
    }
    
    // Add user to session (simplified - in real app would get user name)
    const updatedSession = {
      ...session,
      studentIds: [...session.studentIds, userId],
      studentNames: [...session.studentNames, `User ${userId}`]
    };
    
    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(updatedSessions));
    
    return { ...updatedSession };
  },

  async leaveSession(sessionId, userId) {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new Error('Invalid session ID');
    }
    
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    await delay();
    const sessions = initializeSessions();
    const sessionIndex = sessions.findIndex(s => s.Id === sessionId);
    
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    const session = sessions[sessionIndex];
    
    if (session.teacherId === userId) {
      // Teacher leaving ends the session
      return await this.endSession(sessionId);
    }
    
    const userIndex = session.studentIds.indexOf(userId);
    if (userIndex === -1) {
      throw new Error('User not in session');
    }
    
    const updatedSession = {
      ...session,
      studentIds: session.studentIds.filter(id => id !== userId),
      studentNames: session.studentNames.filter((_, index) => index !== userIndex)
    };
    
    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;
    localStorage.setItem('minhaj-whiteboard-sessions', JSON.stringify(updatedSessions));
    
    return { ...updatedSession };
  },

  async endSession(sessionId) {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new Error('Invalid session ID');
    }
    
    return await this.update(sessionId, {
      isActive: false,
      endedAt: new Date().toISOString()
    });
  },

  async getActiveSessions() {
    const sessions = await this.getAll();
    return sessions.filter(s => s.isActive);
  },

  async getSessionsByTeacher(teacherId) {
    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      throw new Error('Invalid teacher ID');
    }
    
    const sessions = await this.getAll();
    return sessions.filter(s => s.teacherId === teacherId);
  },

  async getSessionsByStudent(studentId) {
    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new Error('Invalid student ID');
    }
    
    const sessions = await this.getAll();
    return sessions.filter(s => s.studentIds.includes(studentId));
  },

  async saveCanvasData(sessionId, canvasData) {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new Error('Invalid session ID');
    }
    
    return await this.update(sessionId, { canvasData });
  },

  async getCanvasData(sessionId) {
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      throw new Error('Invalid session ID');
    }
    
    const session = await this.getById(sessionId);
    return session.canvasData;
  }
};

export default whiteboardService;