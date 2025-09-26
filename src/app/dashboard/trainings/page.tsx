'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
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
import { deleteAllTrainings, deleteTraining, getEnrollments, getTrainings } from '@/lib/actions';
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
import type { Enrollment, Training } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrainingsPage() {
  const [isPending, startTransition] = useTransition();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [enrollmentData, trainingData] = await Promise.all([
        getEnrollments(),
        getTrainings(),
      ]);
      setEnrollments(enrollmentData as Enrollment[]);
      setTrainings(trainingData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'Concluído' || e.status === 'Completed'
  );

  const getTrainingById = (id: string) => trainings.find((t) => t.id === id);

  const handleDelete = (trainingId: string) => {
    startTransition(async () => {
      await deleteTraining(trainingId);
      // Refetch data after deletion
      const enrollmentData = await getEnrollments();
      setEnrollments(enrollmentData as Enrollment[]);
    });
  };

  const handleDeleteAll = () => {
    startTransition(async () => {
      await deleteAllTrainings();
       // Refetch data after deletion
       const enrollmentData = await getEnrollments();
       setEnrollments(enrollmentData as Enrollment[]);
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
                    <Button variant="destructive" disabled={isPending || completedEnrollments.length === 0}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className='space-y-2'>
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : completedEnrollments.length > 0 ? (
                completedEnrollments.map((enrollment) => {
                  const training = getTrainingById(enrollment.trainingId);
                  if (!training) return null;

                  return (
                    <TableRow key={`${enrollment.userId}-${enrollment.trainingId}`}>
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
                            href={`/dashboard/trainings/${enrollment.trainingId}`}
                          >
                            <Award className="h-4 w-4" />
                            <span className="sr-only">Ver Detalhes</span>
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
                                <AlertDialogAction onClick={() => handleDelete(enrollment.trainingId)}>
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