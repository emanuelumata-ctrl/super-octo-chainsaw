'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, addDoc, query, where, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

import type { EnrollmentStatus, Training, User } from './types';

const TrainingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  trainerName: z.string().min(3, 'O nome do treinador deve ter pelo menos 3 caracteres.'),
  trainingDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inválida.',
  }),
  trainingHours: z.coerce.number().min(1, 'As horas de treinamento devem ser pelo menos 1.'),
  qrCodeData: z.string().min(1, "O QR code é obrigatório para validação."),
});


export async function createTraining(prevState: any, formData: FormData) {
  const validatedFields = TrainingSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'A validação falhou. Por favor, verifique os campos.',
    };
  }

  try {
    const newTraining = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      trainerName: validatedFields.data.trainerName,
      trainingDate: validatedFields.data.trainingDate,
      trainingHours: validatedFields.data.trainingHours,
      contentUrl: '#',
      coverImageId: 'technical-onboarding',
    };
    const trainingDocRef = await addDoc(collection(db, "trainings"), newTraining);

    // Automatically enroll the current user (user-1) as "Completed"
    await addDoc(collection(db, "enrollments"), {
      userId: 'user-1', // Assuming user-1 is the logged-in user
      trainingId: trainingDocRef.id,
      status: 'Completed',
      completionDate: new Date().toISOString().split('T')[0],
    });


  } catch (error) {
    return {
      message: 'Erro no Banco de Dados: Falha ao Criar Treinamento.',
    };
  }

  revalidatePath('/dashboard/trainings');
  revalidatePath('/dashboard');
  redirect('/dashboard/trainings');
}

const UserProfileSchema = z.object({
    id: z.string(),
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: z.string().email('Por favor, insira um email válido.'),
    jobTitle: z.string().min(3, 'O cargo deve ter pelo menos 3 caracteres.'),
    admissionDate: z.string(),
    avatar: z.any().optional(),
});
  
export async function updateUserProfile(prevState: any, formData: FormData) {
    const validatedFields = UserProfileSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'A validação falhou. Por favor, verifique os campos.',
        };
    }

    const { id, avatar, ...userData } = validatedFields.data;
    let avatarUrl;

    try {
        const userRef = doc(db, 'users', id);

        if (avatar && avatar.size > 0) {
            const storageRef = ref(storage, `avatars/${id}/${avatar.name}`);
            const snapshot = await uploadBytes(storageRef, avatar);
            avatarUrl = await getDownloadURL(snapshot.ref);
        }

        const dataToUpdate: Partial<User> = { ...userData };
        if (avatarUrl) {
            dataToUpdate.avatarUrl = avatarUrl;
        }

        // Use setDoc with merge: true to create or update the document
        await setDoc(userRef, dataToUpdate, { merge: true });

    } catch (error) {
        console.error("Firebase error:", error);
        return {
            message: 'Erro no Banco de Dados: Falha ao atualizar o perfil.',
        };
    }

    revalidatePath('/dashboard');
    return { message: 'Perfil atualizado com sucesso!', errors: {} };
}


export async function updateUserEnrollment(
  trainingId: string,
  userId: string,
  isEnrolled: boolean
) {
    const q = query(collection(db, "enrollments"), where("trainingId", "==", trainingId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (isEnrolled) { // If switch is turned off (un-enroll)
        if (!querySnapshot.empty) {
            const batch = writeBatch(db);
            querySnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
    } else { // If switch is turned on (enroll)
        if (querySnapshot.empty) {
            await addDoc(collection(db, "enrollments"), {
                trainingId,
                userId,
                status: 'Não Iniciado',
                completionDate: null,
            });
        }
    }
  revalidatePath(`/dashboard/trainings/${trainingId}`);
  revalidatePath('/dashboard/trainings');
  revalidatePath('/dashboard');
}

export async function updateEnrollmentStatus(
  trainingId: string,
  userId: string,
  status: EnrollmentStatus
) {
    const q = query(collection(db, "enrollments"), where("trainingId", "==", trainingId), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const enrollmentDoc = querySnapshot.docs[0];
        const updateData: { status: EnrollmentStatus; completionDate: string | null } = { 
            status,
            completionDate: (status === 'Concluído' || status === 'Completed') 
                ? new Date().toISOString().split('T')[0] 
                : null
        };
        await updateDoc(enrollmentDoc.ref, updateData);
    } else if (status === 'Concluído' || status === 'Completed') {
        // Se não houver inscrição, mas o status for para concluído, criamos uma nova.
        await addDoc(collection(db, "enrollments"), {
            trainingId,
            userId,
            status,
            completionDate: new Date().toISOString().split('T')[0],
        });
    }

    revalidatePath(`/dashboard/trainings/${trainingId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/trainings');
}

export async function deleteTraining({ userId, trainingId }: { userId: string; trainingId: string }) {
    const q = query(collection(db, "enrollments"), where("userId", "==", userId), where("trainingId", "==", trainingId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
    
    revalidatePath('/dashboard/trainings');
    revalidatePath('/dashboard');
}

export async function deleteAllTrainings(userId: string) {
    const q = query(collection(db, "enrollments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
    
    revalidatePath('/dashboard/trainings');
    revalidatePath('/dashboard');
}

export async function getUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getTrainings(): Promise<Training[]> {
    const trainingsCol = collection(db, 'trainings');
    const trainingSnapshot = await getDocs(trainingsCol);
    return trainingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Training));
}

export async function getEnrollments(userId?: string) {
    let enrollmentsCol = collection(db, 'enrollments');
    let q;
    if (userId) {
        q = query(enrollmentsCol, where('userId', '==', userId));
    } else {
        q = query(enrollmentsCol);
    }
    const enrollmentSnapshot = await getDocs(q);
    return enrollmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export async function getTrainingById(id: string) {
    const trainingDocRef = doc(db, 'trainings', id);
    const trainingDoc = await getDoc(trainingDocRef);
    if (trainingDoc.exists()) {
        return { id: trainingDoc.id, ...trainingDoc.data() } as Training;
    }
    return null;
}

export async function getEnrollmentsByTrainingId(trainingId: string) {
    const q = query(collection(db, 'enrollments'), where('trainingId', '==', trainingId));
    const enrollmentSnapshot = await getDocs(q);
    return enrollmentSnapshot.docs.map(doc => doc.data());
}

export async function getUserById(id: string): Promise<User | null> {
    try {
        const userDocRef = doc(db, 'users', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}
