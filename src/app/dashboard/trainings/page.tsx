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
import { PlusCircle, Award, Trash2 } from 'lucide-react';
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

export default function TrainingsPage() {
  const loggedInUserId = 'user-1';
  let [isPending, startTransition] = useTransition();

  const userEnrollments = enrollments.filter(
    (e) => e.userId === loggedInUserId && e.status === 'Concluído'
  );

  const getTrainingById = (id: string) => trainings.find((t) => t.id === id);

  const handleDelete = (trainingId: string) => {
    startTransition(async () => {
      await deleteTraining(trainingId);
    });
  };

  const handleDeleteAll = () => {
    startTransition(async () => {
      await deleteAllTrainings();
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Meus Registros de Treinamento"
        description="Aqui está o seu histórico de todos os treinamentos concluídos."
      >
        <div className="flex gap-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isPending || userEnrollments.length === 0}>
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
      </PageHeader>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Treinamento</TableHead>
                <TableHead>Data de Conclusão</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead className="text-right">Certificado</TableHead>
                <TableHead className="w-[50px] text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userEnrollments.length > 0 ? (
                userEnrollments.map((enrollment) => {
                  const training = getTrainingById(enrollment.trainingId);
                  if (!training) return null;

                  return (
                    <TableRow key={enrollment.trainingId}>
                      <TableCell className="font-medium">
                        <p>{training.title}</p>
                        <p className="text-xs text-muted-foreground">
                          por {training.trainerName}
                        </p>
                      </TableCell>
                      <TableCell>
                        {enrollment.completionDate
                          ? new Date(
                              enrollment.completionDate + 'T00:00:00'
                            ).toLocaleDateString('pt-BR')
                          : '-'}
                      </TableCell>
                      <TableCell>{training.trainingHours} horas</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/dashboard/certificate/${enrollment.userId}/${enrollment.trainingId}`}
                          >
                            <Award className="h-4 w-4" />
                            <span className="sr-only">Ver Certificado</span>
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
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
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do treinamento "{training.title}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(training.id)}>
                                    {isPending ? 'Excluindo...' : 'Sim, excluir'}
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
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum registro encontrado.
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