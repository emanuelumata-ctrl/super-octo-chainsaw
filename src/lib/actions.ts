'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { trainings, enrollments, users } from './data';
import type { EnrollmentStatus } from './types';
import { summarizeDocument as summarizeDocumentFlow } from '@/ai/flows/summarize-training-documents';

const TrainingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  category: z.enum(['Liderança', 'Técnico', 'Conformidade', 'Habilidades Interpessoais']),
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
      message: 'A validação falhou. Por favor, verifique os campos.',
    };
  }

  try {
    const newTraining = {
      id: `trn-${Date.now()}`,
      ...validatedFields.data,
      contentUrl: '#',
      coverImageId: 'technical-onboarding', // Imagem padrão para novos treinamentos
    };
    trainings.push(newTraining);
  } catch (error) {
    return {
      message: 'Erro no Banco de Dados: Falha ao Criar Treinamento.',
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
        status: 'Não Iniciado',
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
    if (status === 'Concluído') {
      enrollment.completionDate = new Date().toISOString().split('T')[0];
    } else {
      delete enrollment.completionDate;
    }
  }
  revalidatePath(`/dashboard/trainings/${trainingId}`);
}

export async function summarizeDocumentAction(documentContent: string) {
  if (!documentContent || documentContent.trim().length < 50) {
    return { summary: '', error: 'Forneça pelo menos 50 caracteres para resumir.' };
  }

  try {
    const result = await summarizeDocumentFlow({ documentContent });
    return { summary: result.summary, error: '' };
  } catch (e) {
    console.error(e);
    return { summary: '', error: 'Falha ao gerar o resumo. Por favor, tente novamente.' };
  }
}
