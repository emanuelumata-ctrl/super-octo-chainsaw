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
    jobTitle: 'Engenheira de Software',
    admissionDate: '2022-01-10',
  },
  {
    id: 'user-2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    avatarUrl: findImage('user-avatar-2'),
    jobTitle: 'Designer de Produto',
    admissionDate: '2021-11-20',
  },
  {
    id: 'user-3',
    name: 'Carla Dias',
    email: 'carla.dias@example.com',
    avatarUrl: findImage('user-avatar-3'),
    jobTitle: 'Gerente de Projetos',
    admissionDate: '2020-03-15',
  },
  {
    id: 'user-4',
    name: 'Daniel Faria',
    email: 'daniel.faria@example.com',
    avatarUrl: findImage('user-avatar-4'),
    jobTitle: 'Analista de QA',
    admissionDate: '2023-02-28',
  },
  {
    id: 'user-5',
    name: 'Eva Mendes',
    email: 'eva.mendes@example.com',
    avatarUrl: findImage('user-avatar-5'),
    jobTitle: 'Cientista de Dados',
    admissionDate: '2022-09-01',
  },
];

export const trainings: Training[] = [
  {
    id: 'trn-1',
    title: 'Princípios de Liderança',
    description:
      'Domine os princípios essenciais de liderança eficaz e gestão de equipes.',
    contentUrl: '#',
    coverImageId: 'leadership-training',
    trainerName: 'Carlos Andrade',
    trainingDate: '2024-05-20',
    trainingHours: 8,
  },
  {
    id: 'trn-2',
    title: 'Onboarding Técnico para Devs',
    description:
      'Fique por dentro de nossa stack de tecnologia, fluxos de desenvolvimento e melhores práticas.',
    contentUrl: '#',
    coverImageId: 'technical-onboarding',
    trainerName: 'Fernanda Lima',
    trainingDate: '2024-06-10',
    trainingHours: 16,
  },
  {
    id: 'trn-3',
    title: 'Conformidade e Segurança de Dados',
    description:
      'Entenda suas responsabilidades em relação à privacidade de dados e conformidade da empresa.',
    contentUrl: '#',
    coverImageId: 'compliance-basics',
    trainerName: 'Roberto Almeida',
    trainingDate: '2024-07-01',
    trainingHours: 4,
  },
  {
    id: 'trn-4',
    title: 'Comunicação Efetiva',
    description:
      'Melhore suas habilidades de comunicação para uma melhor colaboração e trabalho em equipe.',
    contentUrl: '#',
    coverImageId: 'communication-skills',
    trainerName: 'Sofia Bernardes',
    trainingDate: '2024-08-15',
    trainingHours: 6,
  },
];

export let enrollments: Enrollment[] = [
  {
    userId: 'user-1',
    trainingId: 'trn-1',
    status: 'Concluído',
    completionDate: '2023-10-15',
  },
  { userId: 'user-1', trainingId: 'trn-2', status: 'Em Progresso' },
  { userId: 'user-2', trainingId: 'trn-1', status: 'Em Progresso' },
  {
    userId: 'user-2',
    trainingId: 'trn-3',
    status: 'Concluído',
    completionDate: '2023-11-01',
  },
  { userId: 'user-3', trainingId: 'trn-1', status: 'Não Iniciado' },
  { userId: 'user-4', trainingId: 'trn-4', status: 'Em Progresso' },
];
