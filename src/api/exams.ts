import { API_CONFIG } from '../config/api';
import { Exam } from '../types';
import { apiRequest } from './client';
import { mockGetExams } from './mockData';

export const examsApi = {
  getAll: async (): Promise<Exam[]> => {
    if (API_CONFIG.USE_MOCK) {
      return mockGetExams();
    }
    return apiRequest<Exam[]>('/exams');
  },

  getUpcoming: async (): Promise<Exam[]> => {
    const exams = API_CONFIG.USE_MOCK
      ? await mockGetExams()
      : await apiRequest<Exam[]>('/exams?status=upcoming');
    return exams.filter((e) => e.status === 'upcoming');
  },
};
