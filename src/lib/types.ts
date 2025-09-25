export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type TrainingCategory =
  | 'Liderança'
  | 'Técnico'
  | 'Conformidade'
  | 'Habilidades Interpessoais';

export type Training = {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  contentUrl: string; // Could be video link, doc path, etc.
  coverImageId: string;
};

export type EnrollmentStatus = 'Não Iniciado' | 'Em Progresso' | 'Concluído';

export type Enrollment = {
  userId: string;
  trainingId: string;
  status: EnrollmentStatus;
  completionDate?: string;
};
