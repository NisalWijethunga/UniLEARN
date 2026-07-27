export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  semester: number;
  avatar?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  lecturer: string;
  credits: number;
  progress: number;
  schedule: string;
  color: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

export interface Exam {
  id: string;
  courseCode: string;
  courseTitle: string;
  examType: 'Midterm' | 'Final' | 'Quiz' | 'Practical';
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  seatNumber?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
