import { Student } from './types';

export const MOCK_MODE = true;
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', studentCode: 'STU-2024-001', course: 'Computer Science', status: 'active', year: 2, email: 'alice@uni.edu' },
  { id: 's2', name: 'Bob Williams', studentCode: 'STU-2024-002', course: 'Mathematics', status: 'active', year: 3, email: 'bob@uni.edu' },
  { id: 's3', name: 'Clara Davis', studentCode: 'STU-2024-003', course: 'Physics', status: 'probation', year: 1, email: 'clara@uni.edu' },
  { id: 's4', name: 'Daniel Brown', studentCode: 'STU-2024-004', course: 'Computer Science', status: 'active', year: 4, email: 'daniel@uni.edu' },
  { id: 's5', name: 'Elena Martinez', studentCode: 'STU-2024-005', course: 'Biology', status: 'active', year: 2, email: 'elena@uni.edu' },
  { id: 's6', name: 'Frank Taylor', studentCode: 'STU-2024-006', course: 'Chemistry', status: 'inactive', year: 3, email: 'frank@uni.edu' },
  { id: 's7', name: 'Grace Lee', studentCode: 'STU-2024-007', course: 'English Literature', status: 'active', year: 1, email: 'grace@uni.edu' },
  { id: 's8', name: 'Henry Wilson', studentCode: 'STU-2024-008', course: 'Computer Science', status: 'active', year: 2, email: 'henry@uni.edu' },
  { id: 's9', name: 'Isabella Clark', studentCode: 'STU-2024-009', course: 'Mathematics', status: 'probation', year: 4, email: 'isabella@uni.edu' },
  { id: 's10', name: 'James Anderson', studentCode: 'STU-2024-010', course: 'Physics', status: 'active', year: 1, email: 'james@uni.edu' },
  { id: 's11', name: 'Katherine Thomas', studentCode: 'STU-2024-011', course: 'Biology', status: 'active', year: 3, email: 'katherine@uni.edu' },
  { id: 's12', name: 'Liam Jackson', studentCode: 'STU-2024-012', course: 'Chemistry', status: 'active', year: 2, email: 'liam@uni.edu' },
  { id: 's13', name: 'Mia White', studentCode: 'STU-2024-013', course: 'English Literature', status: 'inactive', year: 4, email: 'mia@uni.edu' },
  { id: 's14', name: 'Noah Harris', studentCode: 'STU-2024-014', course: 'Computer Science', status: 'active', year: 1, email: 'noah@uni.edu' },
  { id: 's15', name: 'Olivia Martin', studentCode: 'STU-2024-015', course: 'Mathematics', status: 'active', year: 3, email: 'olivia@uni.edu' },
];

let students = [...MOCK_STUDENTS];

export const studentService = {
  async getAll(filters?: { status?: string; search?: string }): Promise<Student[]> {
    await delay();
    let result = [...students];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q));
    }
    return result;
  },

  async getById(id: string): Promise<Student | undefined> {
    await delay(300);
    return students.find(s => s.id === id);
  },

  async create(data: Omit<Student, 'id'>): Promise<Student> {
    await delay();
    const newStudent: Student = { ...data, id: `s${Date.now()}` };
    students.unshift(newStudent);
    return newStudent;
  },

  async update(id: string, data: Partial<Student>): Promise<Student> {
    await delay();
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    students[idx] = { ...students[idx], ...data };
    return students[idx];
  },

  async remove(id: string): Promise<void> {
    await delay();
    students = students.filter(s => s.id !== id);
  },

  async getCount(): Promise<number> {
    await delay(200);
    return students.length;
  },
};
