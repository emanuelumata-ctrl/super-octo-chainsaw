'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { trainings, enrollments } from '@/lib/data';
import { deleteTraining, deleteAllTrainings } from '@/lib/actions';
import { Eye, PlusCircle, Trash2, ClipboardList } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function TrainingsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteTraining = (trainingId: string) => {
    startTransition(async () => {
      await deleteTraining(trainingId);
      toast({ title: 'Sucesso!', description: 'Treinamento apagado.' });
    });
  };

  const handleDeleteAllTrainings = () => {
    startTransition(async () => {
      await deleteAllTrainings();
      toast({ title: 'Sucesso!', description: 'Todos os treinamentos foram apagados.' });
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Módulos de Treinamento"
        description={`Gerencie os ${trainings.length} módulos de treinamento disponíveis.`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={trainings.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              Apagar Tudo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso apagará permanentemente
                todos os treinamentos e seus dados de inscrição.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAllTrainings}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button asChild variant="secondary">
          <Link href="/dashboard/records">
            <ClipboardList className="mr-2 h-4 w-4" />
            Meus Registros
          </Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Treinamento
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Usuários Inscritos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.length > 0 ? (
                trainings.map((training) => {
                  const enrolledCount = enrollments.filter(
                    (e) => e.trainingId === training.id
                  ).length;
                  return (
                    <TableRow
                      key={training.id}
                      className={isPending ? 'opacity-50' : ''}
                    >
                      <TableCell className="font-medium">
                        {training.title}
                      </TableCell>
                      <TableCell>{enrolledCount}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/dashboard/trainings/${training.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver Detalhes</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Apagar</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza que deseja apagar?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso removerá o
                                treinamento e todas as inscrições associadas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteTraining(training.id)
                                }
                              >
                                Apagar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhum treinamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
