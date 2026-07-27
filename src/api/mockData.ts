import { User, Course, Assignment, Exam, AuthResponse } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Nisal Wijethunga',
  email: 'nisal@students.nsbm.ac.lk',
  studentId: 'NSBM/2024/IT/0421',
  program: 'BSc (Hons) in Computer Science',
  semester: 4,
};

export const mockCourses: Course[] = [
  {
    id: '1',
    code: 'SE401',
    title: 'Advanced Software Engineering',
    lecturer: 'Dr. Nimal Silva',
    credits: 3,
    progress: 72,
    schedule: 'Mon & Wed, 9:00 AM',
    color: '#006B3F',
  },
  {
    id: '2',
    code: 'CS302',
    title: 'Database Management Systems',
    lecturer: 'Prof. Anjali Fernando',
    credits: 3,
    progress: 85,
    schedule: 'Tue & Thu, 11:00 AM',
    color: '#00875A',
  },
  {
    id: '3',
    code: 'IT305',
    title: 'Mobile Application Development',
    lecturer: 'Mr. Ruwan Jayasinghe',
    credits: 3,
    progress: 60,
    schedule: 'Fri, 2:00 PM',
    color: '#004D2E',
  },
  {
    id: '4',
    code: 'MA201',
    title: 'Statistics for Computing',
    lecturer: 'Dr. Priya Wickramasinghe',
    credits: 2,
    progress: 45,
    schedule: 'Wed, 3:00 PM',
    color: '#10B981',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    courseCode: 'SE401',
    title: 'Design Patterns Case Study',
    dueDate: '2026-08-05',
    status: 'pending',
  },
  {
    id: '2',
    courseId: '2',
    courseCode: 'CS302',
    title: 'ER Diagram & Normalization',
    dueDate: '2026-07-30',
    status: 'submitted',
  },
  {
    id: '3',
    courseId: '3',
    courseCode: 'IT305',
    title: 'React Native LMS App',
    dueDate: '2026-08-10',
    status: 'pending',
  },
  {
    id: '4',
    courseId: '4',
    courseCode: 'MA201',
    title: 'Probability Worksheet 3',
    dueDate: '2026-07-25',
    status: 'graded',
    grade: 'A-',
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    courseCode: 'SE401',
    courseTitle: 'Advanced Software Engineering',
    examType: 'Midterm',
    date: '2026-08-12',
    startTime: '09:00',
    endTime: '11:00',
    venue: 'Block A - Hall 201',
    seatNumber: 'A-24',
    status: 'upcoming',
  },
  {
    id: '2',
    courseCode: 'CS302',
    courseTitle: 'Database Management Systems',
    examType: 'Final',
    date: '2026-08-18',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'Block B - Lab 105',
    seatNumber: 'B-12',
    status: 'upcoming',
  },
  {
    id: '3',
    courseCode: 'IT305',
    courseTitle: 'Mobile Application Development',
    examType: 'Practical',
    date: '2026-08-08',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'IT Lab - Floor 3',
    seatNumber: 'C-08',
    status: 'upcoming',
  },
  {
    id: '4',
    courseCode: 'MA201',
    courseTitle: 'Statistics for Computing',
    examType: 'Quiz',
    date: '2026-07-20',
    startTime: '15:00',
    endTime: '16:00',
    venue: 'Block C - Room 302',
    status: 'completed',
  },
];

export const mockLogin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  await delay(800);
  if (email && password.length >= 4) {
    return { token: 'mock-jwt-token-nsbm-unilearn', user: mockUser };
  }
  throw new Error('Invalid email or password');
};

export const mockGetCourses = async (): Promise<Course[]> => {
  await delay(600);
  return mockCourses;
};

export const mockGetAssignments = async (): Promise<Assignment[]> => {
  await delay(500);
  return mockAssignments;
};

export const mockGetExams = async (): Promise<Exam[]> => {
  await delay(500);
  return mockExams;
};

export const mockGetProfile = async (): Promise<User> => {
  await delay(400);
  return mockUser;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
