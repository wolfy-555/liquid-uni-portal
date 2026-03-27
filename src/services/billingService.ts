import { BillingItem } from './types';

export const MOCK_MODE = true;
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

const MOCK_BILLING: BillingItem[] = [
  { id: 'b1', studentId: 's1', description: 'Tuition Fee — Fall 2024', amount: 4500, dueDate: '2024-09-01', status: 'paid' },
  { id: 'b2', studentId: 's1', description: 'Lab Equipment Fee', amount: 350, dueDate: '2024-09-15', status: 'paid' },
  { id: 'b3', studentId: 's1', description: 'Tuition Fee — Spring 2025', amount: 4500, dueDate: '2025-01-15', status: 'pending' },
  { id: 'b4', studentId: 's2', description: 'Tuition Fee — Fall 2024', amount: 4200, dueDate: '2024-09-01', status: 'paid' },
  { id: 'b5', studentId: 's2', description: 'Library Fine', amount: 25, dueDate: '2024-11-10', status: 'overdue' },
  { id: 'b6', studentId: 's3', description: 'Tuition Fee — Fall 2024', amount: 4500, dueDate: '2024-09-01', status: 'overdue' },
  { id: 'b7', studentId: 's3', description: 'Student Activity Fee', amount: 150, dueDate: '2024-09-15', status: 'overdue' },
  { id: 'b8', studentId: 's4', description: 'Tuition Fee — Fall 2024', amount: 4500, dueDate: '2024-09-01', status: 'paid' },
  { id: 'b9', studentId: 's5', description: 'Tuition Fee — Fall 2024', amount: 4500, dueDate: '2024-09-01', status: 'paid' },
  { id: 'b10', studentId: 's5', description: 'Tuition Fee — Spring 2025', amount: 4500, dueDate: '2025-01-15', status: 'pending' },
  { id: 'b11', studentId: 's6', description: 'Tuition Fee — Fall 2024', amount: 4200, dueDate: '2024-09-01', status: 'overdue' },
  { id: 'b12', studentId: 's7', description: 'Tuition Fee — Fall 2024', amount: 4500, dueDate: '2024-09-01', status: 'paid' },
];

export const billingService = {
  async getByStudent(studentId: string): Promise<BillingItem[]> {
    await delay();
    return MOCK_BILLING.filter(b => b.studentId === studentId);
  },

  async getOverdueCount(): Promise<number> {
    await delay(200);
    return MOCK_BILLING.filter(b => b.status === 'overdue').length;
  },

  async getAll(): Promise<BillingItem[]> {
    await delay();
    return [...MOCK_BILLING];
  },
};
