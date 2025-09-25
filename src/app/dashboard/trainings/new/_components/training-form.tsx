'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createTraining } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const TrainingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  trainerName: z.string().min(3, 'O nome do treinador deve ter pelo menos 3 caracteres.'),
  trainingDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inválida.',
  }),
  trainingHours: z.coerce.number().min(1, 'As horas de treinamento devem ser pelo menos 1.'),
});

interface TrainingFormProps {
    initialData?: {
        title?: string;
        trainerName?: string;
        trainingDate?: string;
        trainingHours?: number;
    } | null;
}

export function TrainingForm({ initialData }: TrainingFormProps) {
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(createTraining, initialState);

  const form = useForm<z.infer<typeof TrainingSchema>>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      title: '',
      description: '',
      trainerName: '',
      trainingDate: '',
      trainingHours: 1,
    },
  });
  
  useEffect(() => {
    if (initialData) {
      if (initialData.title) form.setValue('title', initialData.title);
      if (initialData.trainerName) form.setValue('trainerName', initialData.trainerName);
      if (initialData.trainingDate) form.setValue('trainingDate', initialData.trainingDate);
      if (initialData.trainingHours) form.setValue('trainingHours', initialData.trainingHours);
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form action={dispatch} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="ex: Padrões Avançados de React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trainerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Treinador</FormLabel>
              <FormControl>
                <Input placeholder="ex: Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="trainingDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Data do Treinamento</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="trainingHours"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Horas de Treinamento</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o módulo de treinamento..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {state.message && (
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
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Criando...' : 'Criar Treinamento'}
    </Button>
  );
}
