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
    title: 'Princípios de Liderança',
    description:
      'Domine os princípios essenciais de liderança eficaz e gestão de equipes.',
    category: 'Liderança',
    contentUrl: '#',
    coverImageId: 'leadership-training',
  },
  {
    id: 'trn-2',
    title: 'Onboarding Técnico para Devs',
    description:
      'Fique por dentro de nossa stack de tecnologia, fluxos de desenvolvimento e melhores práticas.',
    category: 'Técnico',
    contentUrl: '#',
    coverImageId: 'technical-onboarding',
  },
  {
    id: 'trn-3',
    title: 'Conformidade e Segurança de Dados',
    description:
      'Entenda suas responsabilidades em relação à privacidade de dados e conformidade da empresa.',
    category: 'Conformidade',
    contentUrl: '#',
    coverImageId: 'compliance-basics',
  },
  {
    id: 'trn-4',
    title: 'Comunicação Efetiva',
    description:
      'Melhore suas habilidades de comunicação para uma melhor colaboração e trabalho em equipe.',
    category: 'Habilidades Interpessoais',
    contentUrl: '#',
    coverImageId: 'communication-skills',
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
