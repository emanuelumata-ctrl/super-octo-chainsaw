'use server';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEnrollmentsByTrainingId, getTrainingById, getUsers } from '@/lib/actions';
import type { Training } from '@/lib/types';
import { BadgeCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getTrainingData(id: string): Promise<{ training: Training | null, enrollments: any[], users: any[] }> {
    const training = await getTrainingById(id);
    if (!training) {
        return { training: null, enrollments: [], users: [] };
    }
    const enrollments = await getEnrollmentsByTrainingId(id);
    const users = await getUsers();
    return { training, enrollments, users };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { training, enrollments, users } = await getTrainingData(params.id);

  if (!training) {
    notFound();
  }
  
  const loggedInUserId = 'user-1';
  const userEnrollment = enrollments.find(e => e.userId === loggedInUserId);
  const isCompleted = userEnrollment?.status === 'Completed' || userEnrollment?.status === 'Concluído';

  const image = PlaceHolderImages.find((p) => p.id === training.coverImageId);

  return (
    <div className="space-y-8">
      <PageHeader
        title={training.title}
        description={`Por ${training.trainerName} - ${training.trainingHours} horas`}
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="overflow-hidden">
                {image && (
                <Image
                    src={image.imageUrl}
                    alt={training.title}
                    width={600}
                    height={400}
                    data-ai-hint={image.imageHint}
                    className="aspect-video w-full object-cover"
                />
                )}
                <CardHeader>
                <CardTitle>Sobre este treinamento</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">{training.description}</p>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Alert>
                <BadgeCheck className="h-4 w-4" />
                <AlertTitle>Treinamento Realizado</AlertTitle>
                <AlertDescription>
                    Você concluiu este treinamento. Seu certificado está disponível.
                </AlertDescription>
            </Alert>

            {isCompleted && userEnrollment && (
                 <Button asChild className="w-full">
                    <Link href={`/dashboard/certificate/${userEnrollment.userId}/${userEnrollment.trainingId}`}>
                        Ver Certificado
                    </Link>
                 </Button>
            )}
        </div>
      </div>
    </div>
  );
}
