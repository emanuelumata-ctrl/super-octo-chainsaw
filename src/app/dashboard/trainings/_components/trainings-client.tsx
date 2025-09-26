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
import { deleteAllTrainings, deleteTraining } from '@/lib/actions';

function DeleteAllButton({ hasEnrollments, isPending, onDelete }: { hasEnrollments: boolean, isPending: boolean, onDelete: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending || !hasEnrollments}>
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
                <AlertDialogAction onClick={onDelete}>
                    {isPending ? 'Excluindo...' : 'Sim, excluir tudo'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


function DeleteButton({ trainingId, trainingTitle }: { trainingId: string, trainingTitle: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteTraining(trainingId);
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do treinamento "{trainingTitle}".
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Excluindo...' : 'Sim, excluir'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function TrainingsClient({ completedEnrollmentsCount }: { completedEnrollmentsCount: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDeleteAll = () => {
        startTransition(async () => {
            await deleteAllTrainings();
        });
    };

    return (
        <div className="flex gap-2">
            <DeleteAllButton 
                hasEnrollments={completedEnrollmentsCount > 0} 
                isPending={isPending} 
                onDelete={handleDeleteAll}
            />
            <Button asChild>
            <Link href="/dashboard/trainings/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Treinamento
            </Link>
            </Button>
        </div>
    )
}

TrainingsClient.DeleteButton = DeleteButton;
