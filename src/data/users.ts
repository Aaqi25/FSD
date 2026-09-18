import { User } from '../types';

export const mockUsers: User[] = [
  {
    _id: 'usr_001',
    name: 'Alex Johnson',
    username: 'alex_home',
    email: 'alex.johnson@example.com',
    role: 'owner',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    _id: 'usr_002',
    name: 'Sarah Johnson',
    username: 'sarah_j',
    email: 'sarah.j@example.com',
    role: 'resident',
    createdAt: '2025-02-01T10:30:00.000Z',
  },
];

export const defaultUser = mockUsers[0];
