'use server';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle,
  Trophy,
  Award
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Progress } from '@/components/ui/progress';
import { ProfileCard } from './_components/profile-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Enrollment, Training, User } from '@/lib/types';
import { getEnrollments, getTrainings, getAuthenticatedUser } from '@/lib/actions';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    // This case should ideally be handled by middleware, but as a fallback:
    return (
        <div className="space-y-8">
            <PageHeader
                title="Usuário não encontrado"
                description="Não foi possível carregar as informações do usuário."
            />
        </div>
    )
  }
  
  // If user profile is not complete, show profile card to complete it
  if (!user.registration) {
    return (
      <div className="max-w-3xl mx-auto">
        <ProfileCard user={user} />
      </div>
    )
  }

  const [userEnrollments, allTrainings] = await Promise.all([
    getEnrollments(),
    getTrainings()
  ]);

  const completedEnrollments = (userEnrollments as Enrollment[]).filter(
    (e) => e.status === 'Concluído' || e.status === 'Completed'
  );
  const inProgressEnrollments = (userEnrollments as Enrollment[]).filter(
    (e) => e.status === 'Em Progresso'
  );

  const totalCompleted = completedEnrollments.length;
  const totalInProgress = inProgressEnrollments.length;
  const totalTrainingsForUser = (userEnrollments as Enrollment[]).length;

  const experience =
    totalTrainingsForUser > 0
      ? Math.round((totalCompleted / totalTrainingsForUser) * 100)
      : 0;

  const getTrainingById = (id: string) => allTrainings.find((t) => t.id === id);
  
  return (
    <div className="space-y-8">
      <PageHeader
        title={`Bem-vindo(a), ${user.name}!`}
        description="Aqui está um resumo da sua jornada de aprendizado."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Treinamentos Concluídos
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  Total de módulos finalizados.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Treinamentos em Andamento
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInProgress}</div>
                <p className="text-xs text-muted-foreground">
                  Continue seu progresso!
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Barra de Experiência
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{experience}%</div>
                <Progress value={experience} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
                <CardHeader>
                    <CardTitle>Meus Registros de Treinamento</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
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
                      {completedEnrollments.length > 0 ? (
                        completedEnrollments.map((enrollment) => {
                          const training = getTrainingById(enrollment.trainingId);
                          if (!training) return null;

                          return (
                            <TableRow key={enrollment.id}>
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
                                    <Link href={`/dashboard/trainings/${enrollment.trainingId}`}>
                                        <Award className="h-4 w-4" />
                                        <span className="sr-only">Ver Detalhes</span>
                                    </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            Nenhum treinamento concluído ainda.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}
