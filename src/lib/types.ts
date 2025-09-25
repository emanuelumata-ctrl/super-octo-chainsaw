export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export type TrainingCategory =
  | 'Leadership'
  | 'Technical'
  | 'Compliance'
  | 'Soft Skills';

export type Training = {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  contentUrl: string; // Could be video link, doc path, etc.
  coverImageId: string;
};

export type EnrollmentStatus = 'Not Started' | 'In Progress' | 'Completed';

export type Enrollment = {
  userId: string;
  trainingId: string;
  status: EnrollmentStatus;
  completionDate?: string;
};
