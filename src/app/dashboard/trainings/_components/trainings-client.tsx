'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteAllTrainings } from '@/lib/actions';

interface TrainingsClientProps {
    completedEnrollmentsCount: number;
}

export function TrainingsClient({ completedEnrollmentsCount }: TrainingsClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleDeleteAll = () => {
        startTransition(async () => {
            await deleteAllTrainings();
        });
    };

    return (
        <div className="flex gap-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isPending || completedEnrollmentsCount === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Tudo
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso excluirá permanentemente todos os seus registros de treinamento.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll}>
                        {isPending ? 'Excluindo...' : 'Sim, excluir tudo'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button asChild>
            <Link href="/dashboard/trainings/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Treinamento
            </Link>
            </Button>
        </div>
    )
}
