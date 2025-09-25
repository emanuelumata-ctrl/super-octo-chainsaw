import type { Enrollment, Training, User } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

// Helper to find image URL from placeholder data
const findImage = (id: string) =>
  PlaceHolderImages.find((img) => img.id === id)?.imageUrl ?? '';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    avatarUrl: findImage('user-avatar-1'),
  },
  {
    id: 'user-2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    avatarUrl: findImage('user-avatar-2'),
  },
  {
    id: 'user-3',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    avatarUrl: findImage('user-avatar-3'),
  },
  {
    id: 'user-4',
    name: 'Daniel Faria',
    email: 'daniel.faria@example.com',
    avatarUrl: findImage('user-avatar-4'),
  },
  {
    id: 'user-5',
    name: 'Eva Mendes',
    email: 'eva.mendes@example.com',
    avatarUrl: findImage('user-avatar-5'),
  },
];

export const trainings: Training[] = [
  {
    id: 'trn-1',
    title: 'Leadership Principles',
    description:
      'Master the core principles of effective leadership and team management.',
    category: 'Leadership',
    contentUrl: '#',
    coverImageId: 'leadership-training',
  },
  {
    id: 'trn-2',
    title: 'Technical Onboarding for Devs',
    description:
      'Get up to speed with our tech stack, development workflows, and best practices.',
    category: 'Technical',
    contentUrl: '#',
    coverImageId: 'technical-onboarding',
  },
  {
    id: 'trn-3',
    title: 'Compliance & Data Security',
    description:
      'Understand your responsibilities regarding data privacy and company compliance.',
    category: 'Compliance',
    contentUrl: '#',
    coverImageId: 'compliance-basics',
  },
  {
    id: 'trn-4',
    title: 'Effective Communication',
    description:
      'Improve your communication skills for better collaboration and teamwork.',
    category: 'Soft Skills',
    contentUrl: '#',
    coverImageId: 'communication-skills',
  },
];

export let enrollments: Enrollment[] = [
  {
    userId: 'user-1',
    trainingId: 'trn-1',
    status: 'Completed',
    completionDate: '2023-10-15',
  },
  { userId: 'user-1', trainingId: 'trn-2', status: 'In Progress' },
  { userId: 'user-2', trainingId: 'trn-1', status: 'In Progress' },
  {
    userId: 'user-2',
    trainingId: 'trn-3',
    status: 'Completed',
    completionDate: '2023-11-01',
  },
  { userId: 'user-3', trainingId: 'trn-1', status: 'Not Started' },
  { userId: 'user-4', trainingId: 'trn-4', status: 'In Progress' },
];
