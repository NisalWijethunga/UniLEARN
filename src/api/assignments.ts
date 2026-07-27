import { API_CONFIG } from '../config/api';
import { Assignment } from '../types';
import { apiRequest } from './client';
import { mockGetAssignments } from './mockData';

export const assignmentsApi = {
  getAll: async (): Promise<Assignment[]> => {
    if (API_CONFIG.USE_MOCK) {
      return mockGetAssignments();
    }
    return apiRequest<Assignment[]>('/assignments');
  },

  submit: async (assignmentId: string, data: FormData): Promise<Assignment> => {
    if (API_CONFIG.USE_MOCK) {
      const assignments = await mockGetAssignments();
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');
      return { ...assignment, status: 'submitted' };
    }
    return apiRequest<Assignment>(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: data,
    });
  },
};
