'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { User } from '@/lib/types';
import { updateUserProfile } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const UserProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Por favor, insira um email válido.'),
  registration: z.string().min(1, 'A matrícula é obrigatória.'),
  jobTitle: z.string().min(3, 'O cargo deve ter pelo menos 3 caracteres.'),
  admissionDate: z.string(),
  avatar: z.any().optional(),
});

interface EditProfileFormProps {
  user: User;
  onFormSubmit: () => void;
  isNewUser?: boolean;
}

export function EditProfileForm({ user, onFormSubmit, isNewUser = false }: EditProfileFormProps) {
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<{ message: string | null }>({ message: null });

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      registration: user.registration || '',
      jobTitle: user.jobTitle || '',
      admissionDate: user.admissionDate || '',
    },
  });

  const avatarRef = form.register("avatar");

  const handleFormAction = async (formData: FormData) => {
    const result = await updateUserProfile(null, formData);

    if (result && result.message && result.errors) {
      setErrorState({ message: result.message });
    } else if (result && result.message) {
      toast({ title: 'Sucesso!', description: result.message });
      onFormSubmit();
      if (isNewUser) {
          window.location.reload();
      }
    }
  };

  return (
    <Form {...form}>
    <form action={handleFormAction} className="space-y-4">
        {user.id && <input type="hidden" name="id" value={user.id} />}
        <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
                <Input {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Cargo</FormLabel>
            <FormControl>
                <Input {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="admissionDate"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Data de Admissão</FormLabel>
            <FormControl>
                <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
            control={form.control}
            name="avatar"
            render={() => (
                <FormItem>
                    <FormLabel>Foto de Perfil</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" {...avatarRef} />
                    </FormControl>
                    <FormDescription>
                        Procure uma imagem no seu dispositivo.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        {errorState.message && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao Salvar</AlertTitle>
                <AlertDescription>{errorState.message}</AlertDescription>
            </Alert>
        )}

        <SubmitButton isNewUser={isNewUser} />
    </form>
    </Form>
  );
}

function SubmitButton({ isNewUser }: { isNewUser: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (isNewUser ? 'Criando Perfil...' : 'Salvando...') : (isNewUser ? 'Criar Perfil' : 'Salvar Alterações')}
    </Button>
  );
}
