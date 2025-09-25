'use client';

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
} from 'lucide-react';
import { trainings, users, enrollments } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProfileCard } from './_components/profile-card';

export default function DashboardPage() {
  // Simulating a logged-in user. In a real app, this would come from an auth context.
  const loggedInUserId = 'user-1';
  const user = users.find((u) => u.id === loggedInUserId);

  if (!user) {
    return (
      <PageHeader
        title="Usuário não encontrado"
        description="Não foi possível carregar as informações do usuário."
      />
    );
  }

  const userEnrollments = enrollments.filter((e) => e.userId === user.id);
  const completedEnrollments = userEnrollments.filter(
    (e) => e.status === 'Concluído'
  );
  const inProgressEnrollments = userEnrollments.filter(
    (e) => e.status === 'Em Progresso'
  );

  const totalCompleted = completedEnrollments.length;
  const totalInProgress = inProgressEnrollments.length;
  const totalTrainingsForUser = userEnrollments.length;

  const experience =
    totalTrainingsForUser > 0
      ? Math.round((totalCompleted / totalTrainingsForUser) * 100)
      : 0;

  const getTrainingById = (id: string) => trainings.find((t) => t.id === id);
  
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
            <h2 className="mb-4 font-headline text-2xl font-semibold">
              Meus Treinamentos
            </h2>
            {userEnrollments.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {userEnrollments.map((enrollment) => {
                      const training = getTrainingById(enrollment.trainingId);
                      if (!training) return null;

                      const statusColors: Record<
                        typeof enrollment.status,
                        'default' | 'secondary' | 'outline'
                      > = {
                        'Concluído': 'default',
                        'Em Progresso': 'secondary',
                        'Não Iniciado': 'outline',
                      };

                      return (
                        <Link
                          key={training.id}
                          href={`/dashboard/trainings/${training.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-md">
                            <div>
                              <p className="font-semibold">{training.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Por {training.trainerName}
                              </p>
                              {enrollment.status === 'Concluído' &&
                                enrollment.completionDate && (
                                  <p className="text-xs text-muted-foreground">
                                    Concluído em:{' '}
                                    {new Date(
                                      enrollment.completionDate + 'T00:00:00'
                                    ).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                            </div>
                            <Badge variant={statusColors[enrollment.status]}>
                              {enrollment.status}
                            </Badge>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">
                Você ainda não está inscrito em nenhum treinamento.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}
