'use server';

import Link from 'next/link';
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
import { TrainingsClient } from './_components/trainings-client';


export default async function TrainingsPage() {
  const [enrollmentData, trainingData] = await Promise.all([
    getEnrollments(),
    getTrainings(),
  ]);

  const enrollments = enrollmentData as Enrollment[];
  const trainings = trainingData as Training[];
  
  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'Concluído' || e.status === 'Completed'
  );

  const getTrainingById = (id: string) => trainings.find((t) => t.id === id);
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Meus Registros de Treinamento"
        description="Aqui está o seu histórico de todos os treinamentos concluídos."
      >
        <TrainingsClient completedEnrollmentsCount={completedEnrollments.length} />
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
             {completedEnrollments.length > 0 ? (
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
                                <Button variant="ghost" size="icon">
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
                                <AlertDialogAction onClick={() => deleteTraining(enrollment.trainingId)}>
                                    Sim, excluir
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
