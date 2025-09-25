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

const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  jobTitle: z.string().min(3, 'O cargo deve ter pelo menos 3 caracteres.'),
  admissionDate: z.string(),
  avatarUrl: z.string().url('Por favor, insira uma URL de imagem válida.'),
});

export async function updateUserProfile(prevState: any, formData: FormData) {
  const validatedFields = UserProfileSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    jobTitle: formData.get('jobTitle'),
    admissionDate: formData.get('admissionDate'),
    avatarUrl: formData.get('avatarUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'A validação falhou. Por favor, verifique os campos.',
    };
  }

  try {
    const userIndex = users.findIndex(u => u.id === validatedFields.data.id);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }
    
    const user = users[userIndex];
    users[userIndex] = {
      ...user,
      name: validatedFields.data.name,
      jobTitle: validatedFields.data.jobTitle,
      admissionDate: validatedFields.data.admissionDate,
      avatarUrl: validatedFields.data.avatarUrl,
    };

  } catch (error) {
    return {
      message: 'Erro no Banco de Dados: Falha ao atualizar o perfil.',
    };
  }

  revalidatePath('/dashboard');
  // We won't redirect, so the modal can close and show the updated data.
  return { message: 'Perfil atualizado com sucesso!', errors: {} };
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
