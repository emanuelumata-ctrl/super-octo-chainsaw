import { notFound } from 'next/navigation';
import { enrollments, trainings, users } from '@/lib/data';
import { Certificate } from './_components/certificate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CertificatePage({
  params,
}: {
  params: { userId: string; trainingId: string };
}) {
  const enrollment = enrollments.find(
    (e) =>
      e.userId === params.userId &&
      e.trainingId === params.trainingId &&
      e.status === 'Completed'
  );

  if (!enrollment) {
    notFound();
  }

  const user = users.find((u) => u.id === params.userId);
  const training = trainings.find((t) => t.id === params.trainingId);

  if (!user || !training) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
       <div className="flex justify-start">
         <Button asChild variant="outline">
           <Link href={`/dashboard/trainings/${training.id}`}>
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to Training
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
