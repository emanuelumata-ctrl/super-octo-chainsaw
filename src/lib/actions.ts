
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { trainings, enrollments, users } from './data';
import type { EnrollmentStatus } from './types';
import { summarizeDocument as summarizeDocumentFlow } from '@/ai/flows/summarize-training-documents';

const TrainingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.enum(['Leadership', 'Technical', 'Compliance', 'Soft Skills']),
});

export async function createTraining(prevState: any, formData: FormData) {
  const validatedFields = TrainingSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  try {
    const newTraining = {
      id: `trn-${Date.now()}`,
      ...validatedFields.data,
      contentUrl: '#',
      coverImageId: 'technical-onboarding', // Default image for new trainings
    };
    trainings.push(newTraining);
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Training.',
    };
  }

  revalidatePath('/dashboard/trainings');
  redirect('/dashboard/trainings');
}

export async function updateUserEnrollment(
  trainingId: string,
  userId: string,
  isEnrolled: boolean
) {
  if (isEnrolled) {
    enrollments = enrollments.filter(
      (e) => !(e.trainingId === trainingId && e.userId === userId)
    );
  } else {
    if (users.find((u) => u.id === userId)) {
      enrollments.push({
        trainingId,
        userId,
        status: 'Not Started',
      });
    }
  }
  revalidatePath(`/dashboard/trainings/${trainingId}`);
}

export async function updateEnrollmentStatus(
  trainingId: string,
  userId: string,
  status: EnrollmentStatus
) {
  const enrollment = enrollments.find(
    (e) => e.trainingId === trainingId && e.userId === userId
  );

  if (enrollment) {
    enrollment.status = status;
    if (status === 'Completed') {
      enrollment.completionDate = new Date().toISOString().split('T')[0];
    } else {
      delete enrollment.completionDate;
    }
  }
  revalidatePath(`/dashboard/trainings/${trainingId}`);
}

export async function summarizeDocumentAction(documentContent: string) {
  if (!documentContent || documentContent.trim().length < 50) {
    return { summary: '', error: 'Please provide at least 50 characters to summarize.' };
  }

  try {
    const result = await summarizeDocumentFlow({ documentContent });
    return { summary: result.summary, error: '' };
  } catch (e) {
    console.error(e);
    return { summary: '', error: 'Failed to generate summary. Please try again.' };
  }
}
