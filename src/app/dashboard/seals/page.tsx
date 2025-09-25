import { PageHeader } from '@/components/page-header';

export default function SealsPage() {
  const totalSeals = 20;
  const seals = Array.from({ length: totalSeals }, (_, i) => ({
    id: i + 1,
    unlocked: false, // In a real app, this would come from user data
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Selos de Conquista"
        description="Colete todos os selos completando os treinamentos e escaneando os QR codes."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {seals.map((seal) => (
          <div
            key={seal.id}
            className="aspect-square flex flex-col items-center justify-center rounded-full border-4 border-dashed bg-card p-4 transition-all"
          >
            <div
              className="flex h-full w-full items-center justify-center rounded-full bg-muted/50"
            >
              <span className="text-3xl font-bold text-muted-foreground">
                {seal.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
