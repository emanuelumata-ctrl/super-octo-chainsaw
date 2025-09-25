import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { enrollments, trainings } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

export default function RecordsPage() {
  // Simulating a logged-in user. In a real app, this would come from an auth context.
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
      />
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
                            <Link href={`/dashboard/certificate/${enrollment.userId}/${enrollment.trainingId}`}>
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
