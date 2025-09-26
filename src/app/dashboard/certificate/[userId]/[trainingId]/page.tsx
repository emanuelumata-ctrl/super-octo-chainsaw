'use server';

import { notFound } from 'next/navigation';
import { Certificate } from './_components/certificate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getEnrollments, getTrainingById, getUserById } from '@/lib/actions';

export default async function CertificatePage({
  params,
}: {
  params: { userId: string; trainingId: string };
}) {
  const allEnrollments = await getEnrollments();
  const enrollment = allEnrollments.find(
    (e: any) =>
      e.userId === params.userId &&
      e.trainingId === params.trainingId &&
      (e.status === 'Completed' || e.status === 'Concluído')
  );

  if (!enrollment) {
    notFound();
  }

  const user = await getUserById(params.userId);
  const training = await getTrainingById(params.trainingId);

  if (!user || !training) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
       <div className="flex justify-start">
         <Button asChild variant="outline">
           <Link href={`/dashboard/trainings/${training.id}`}>
             <ArrowLeft className="mr-2 h-4 w-4" />
             Voltar ao Treinamento
           </Link>
         </Button>
       </div>
      <Certificate
        userName={user.name}
        trainingTitle={training.title}
        completionDate={enrollment.completionDate ?? ''}
      />
    </div>
  );
}
