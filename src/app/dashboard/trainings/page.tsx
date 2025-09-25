'use client';

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
import { trainings, enrollments } from '@/lib/data';
import { PlusCircle, Award } from 'lucide-react';

export default function TrainingsPage() {
  const loggedInUserId = 'user-1';

  const userEnrollments = enrollments.filter(
    (e) => e.userId === loggedInUserId && e.status === 'Concluído'
  );

  const getTrainingById = (id: string) => trainings.find((t) => t.id === id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Meus Registros de Treinamento"
        description="Aqui está o seu histórico de todos os treinamentos concluídos."
      >
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
                <TableHead>Treinamento</TableHead>
                <TableHead>Data de Conclusão</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead className="text-right">Certificado</TableHead>
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
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
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
