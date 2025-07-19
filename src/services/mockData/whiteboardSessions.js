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

export default mockSessions;