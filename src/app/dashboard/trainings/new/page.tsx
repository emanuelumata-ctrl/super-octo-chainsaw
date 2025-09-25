import { PageHeader } from '@/components/page-header';
import { TrainingForm } from './_components/training-form';
import { Card, CardContent } from '@/components/ui/card';

export default function NewTrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Training"
        description="Fill out the form to add a new training module."
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <TrainingForm />
        </CardContent>
      </Card>
    </div>
  );
}
