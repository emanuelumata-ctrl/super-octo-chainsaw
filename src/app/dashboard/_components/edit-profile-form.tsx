'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import type { User } from '@/lib/types';
import { updateUserProfile } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  jobTitle: z.string().min(3, 'O cargo deve ter pelo menos 3 caracteres.'),
  admissionDate: z.string(),
  avatarUrl: z.string().url('Por favor, insira uma URL de imagem válida.'),
});

interface EditProfileFormProps {
  user: User;
  onFormSubmit: () => void;
}

export function EditProfileForm({ user, onFormSubmit }: EditProfileFormProps) {
  const { toast } = useToast();
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(updateUserProfile, initialState);

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      jobTitle: user.jobTitle,
      admissionDate: user.admissionDate,
      avatarUrl: user.avatarUrl,
    },
  });

  useEffect(() => {
    if (state.message && !state.errors) {
        toast({ title: 'Sucesso!', description: state.message });
        onFormSubmit();
    } else if (state.message && state.errors) {
        toast({ title: 'Erro', description: state.message, variant: 'destructive' });
    }
  }, [state, onFormSubmit, toast]);


  return (
    <Form {...form}>
    <form action={dispatch} className="space-y-4">
        <input type="hidden" name="id" value={user.id} />
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
        name="avatarUrl"
        render={({ field }) => (
            <FormItem>
            <FormLabel>URL da Foto de Perfil</FormLabel>
            <FormControl>
                <Input {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {state.message && state.errors && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
        )}

        <SubmitButton />
    </form>
    </Form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Salvando...' : 'Salvar Alterações'}
    </Button>
  );
}
