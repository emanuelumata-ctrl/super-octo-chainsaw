export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  jobTitle: string;
  admissionDate: string;
};

export type Training = {
  id: string;
  title: string;
  description: string;
  contentUrl: string; // Could be video link, doc path, etc.
  coverImageId: string;
  trainerName: string;
  trainingDate: string;
  trainingHours: number;
};

export type EnrollmentStatus = 'Não Iniciado' | 'Em Progresso' | 'Concluído' | 'Completed';

export type Enrollment = {
  id: string;
  userId: string;
  trainingId: string;
  status: EnrollmentStatus;
  completionDate?: string;
};
