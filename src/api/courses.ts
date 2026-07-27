import { API_CONFIG } from '../config/api';
import { Course } from '../types';
import { apiRequest } from './client';
import { mockGetCourses } from './mockData';

export const coursesApi = {
  getAll: async (): Promise<Course[]> => {
    if (API_CONFIG.USE_MOCK) {
      return mockGetCourses();
    }
    return apiRequest<Course[]>('/courses');
  },

  getById: async (id: string): Promise<Course> => {
    if (API_CONFIG.USE_MOCK) {
      const courses = await mockGetCourses();
      const course = courses.find((c) => c.id === id);
      if (!course) throw new Error('Course not found');
      return course;
    }
    return apiRequest<Course>(`/courses/${id}`);
  },
};
