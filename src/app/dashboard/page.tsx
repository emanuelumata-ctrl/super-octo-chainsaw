import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Users,
} from 'lucide-react';
import { trainings, users, enrollments } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PageHeader } from '@/components/page-header';

export default function DashboardPage() {
  const totalTrainings = trainings.length;
  const totalUsers = users.length;
  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'Completed'
  ).length;
  
  const ongoingTrainings = trainings.filter(t => enrollments.some(e => e.trainingId === t.id && e.status === 'In Progress'));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bem-vindo, Admin!"
        description="Aqui está um resumo da jornada de aprendizado da sua equipe."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinamentos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainings}</div>
            <p className="text-xs text-muted-foreground">
              Módulos disponíveis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Funcionários no sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{completedEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Em todos os módulos
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 font-headline text-2xl font-semibold">Treinamentos em Andamento</h2>
        {ongoingTrainings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ongoingTrainings.map((training) => {
              const image = PlaceHolderImages.find(p => p.id === training.coverImageId);
              return (
              <Card key={training.id} className="overflow-hidden">
                <Link href={`/dashboard/trainings/${training.id}`} className="block h-full transition-shadow duration-200 hover:shadow-lg">
                  {image && (
                     <Image
                      src={image.imageUrl}
                      alt={training.title}
                      width={600}
                      height={400}
                      data-ai-hint={image.imageHint}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{training.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm text-primary">
                    <span>Ver Progresso</span>
                    <ArrowRight className="h-4 w-4" />
                  </CardContent>
                </Link>
              </Card>
            )})}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum treinamento em andamento no momento.</p>
        )}
      </div>
    </div>
  );
}
