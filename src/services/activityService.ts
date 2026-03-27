import { ActivityItem } from './types';

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'student', message: 'Alice Johnson enrolled in CS301', timestamp: '2024-12-20T14:30:00Z' },
  { id: 'a2', type: 'billing', message: 'Payment received from Bob Williams — $4,200', timestamp: '2024-12-20T11:15:00Z' },
  { id: 'a3', type: 'course', message: 'CS401 Machine Learning capacity increased to 30', timestamp: '2024-12-19T16:45:00Z' },
  { id: 'a4', type: 'faculty', message: 'Dr. Ahmed Patel added CHEM202 to schedule', timestamp: '2024-12-19T09:00:00Z' },
  { id: 'a5', type: 'student', message: 'Clara Davis placed on academic probation', timestamp: '2024-12-18T13:20:00Z' },
  { id: 'a6', type: 'billing', message: 'Overdue notice sent to Frank Taylor', timestamp: '2024-12-18T10:00:00Z' },
  { id: 'a7', type: 'course', message: 'New course ENG201 created for Spring 2025', timestamp: '2024-12-17T15:30:00Z' },
];

export const activityService = {
  async getRecent(limit = 7): Promise<ActivityItem[]> {
    await delay();
    return MOCK_ACTIVITY.slice(0, limit);
  },
};
