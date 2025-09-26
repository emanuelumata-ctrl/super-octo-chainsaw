'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/constants';

import { db, storage } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, addDoc, query, where, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

import type { EnrollmentStatus, Training, User } from './types';

// Helper function to get user ID from session cookie (SERVER-SIDE ONLY)
async function getUserIdFromSession(): Promise<string | null> {
    const cookieStore = cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    if (session?.value) {
        return session.value;
    }
    return null;
}

export async function getAuthenticatedUser(): Promise<User | null> {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return null;
    }
    return await getUserById(userId);
}


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
    const user = await getAuthenticatedUser();
    if (!user) {
        return { message: 'Ação não autorizada. Por favor, faça login.' };
    }

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

        // Automatically enroll the current user as "Completed"
        await addDoc(collection(db, "enrollments"), {
            userId: user.id,
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
    id: z.string().optional(),
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: z.string().email('Por favor, insira um email válido.'),
    jobTitle: z.string().min(3, 'O cargo deve ter pelo menos 3 caracteres.'),
    admissionDate: z.string(),
    registration: z.string().min(1, 'A matrícula é obrigatória.'),
    avatar: z.any().optional(),
});
  
export async function updateUserProfile(prevState: any, formData: FormData) {
    const sessionUserId = await getUserIdFromSession();
    if (!sessionUserId) {
        return { message: 'Erro de autenticação. Sessão não encontrada.', errors: {} };
    }

    const validatedFields = UserProfileSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'A validação falhou. Por favor, verifique os campos.',
        };
    }
    
    // Use the ID from the session as the source of truth.
    const { id, avatar, ...userData } = validatedFields.data;
    const userId = id || sessionUserId;

    if (userId !== sessionUserId) {
         return { message: 'Erro de permissão.', errors: {} };
    }


    try {
        const userRef = doc(db, 'users', userId);
        const dataToUpdate: Partial<User> = { ...userData };
        
        if (avatar && avatar.size > 0) {
            const storageRef = ref(storage, `avatars/${userId}/${avatar.name}`);
            const snapshot = await uploadBytes(storageRef, avatar);
            dataToUpdate.avatarUrl = await getDownloadURL(snapshot.ref);
        }

        await setDoc(userRef, dataToUpdate, { merge: true });

    } catch (error) {
        console.error("Firebase error:", error);
        return {
            message: 'Erro no Banco de Dados: Falha ao atualizar o perfil.',
            errors: {}
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
    const user = await getAuthenticatedUser();
    if (!user) {
         return { message: 'Ação não autorizada. Por favor, faça login.' };
    }

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
  const user = await getAuthenticatedUser();
  if (!user) {
    return { message: 'Ação não autorizada. Por favor, faça login.' };
  }
  
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
  } else {
      await addDoc(collection(db, "enrollments"), {
          trainingId,
          userId,
          status,
          completionDate: (status === 'Concluído' || status === 'Completed') ? new Date().toISOString().split('T')[0] : null,
      });
  }

  revalidatePath(`/dashboard/trainings/${trainingId}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/trainings');
}


export async function deleteTraining(trainingId: string) {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { message: 'Ação não autorizada. Por favor, faça login.' };
    }
    const q = query(collection(db, "enrollments"), where("userId", "==", user.id), where("trainingId", "==", trainingId));
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

export async function deleteAllTrainings() {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { message: 'Ação não autorizada. Por favor, faça login.' };
    }
    const q = query(collection(db, "enrollments"), where("userId", "==", user.id));
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

export async function getEnrollments() {
    const user = await getAuthenticatedUser();
    if (!user) {
        return [];
    }
    const enrollmentsCol = collection(db, 'enrollments');
    const q = query(enrollmentsCol, where('userId', '==', user.id));
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


const LoginSchema = z.object({
  name: z.string().trim().min(1, { message: 'O nome é obrigatório.' }),
  registration: z.string().trim().min(1, { message: 'A matrícula é obrigatória.' }),
});

export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Nome e matrícula são obrigatórios.' };
  }
  
  const { name, registration } = validatedFields.data;

  try {
    const usersRef = collection(db, 'users');
    let q = query(usersRef, where('registration', '==', registration));
    let querySnapshot = await getDocs(q);
    let userId: string;

    if (querySnapshot.empty) {
      // User does not exist, create a new one with minimal info
      const newUser = {
        name,
        registration,
        email: '',
        jobTitle: '',
        admissionDate: '',
        avatarUrl: `https://i.pravatar.cc/150?u=${registration}`, 
      };
      const userDocRef = await addDoc(usersRef, newUser);
      userId = userDocRef.id;
    } else {
        const userDoc = querySnapshot.docs[0];
        if (userDoc.data().name.toLowerCase() !== name.toLowerCase()) {
            return { error: 'A matrícula já está em uso com um nome diferente.' };
        }
        userId = userDoc.id;
    }

    cookies().set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Ocorreu um erro no servidor. Tente novamente.' };
  }

  redirect('/dashboard');
}


export async function handleLogout() {
    cookies().delete(SESSION_COOKIE_NAME);
    redirect('/');
}
