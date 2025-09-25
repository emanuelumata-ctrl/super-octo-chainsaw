import { PageHeader } from '@/components/page-header';
import { TrainingForm } from './_components/training-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCodeReader } from './_components/qrcode-reader';
import { Separator } from '@/components/ui/separator';

export default function NewTrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Criar Novo Treinamento"
        description="Preencha o formulário ou escaneie um QR code para adicionar um novo módulo."
      />
      <div className="max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <TrainingForm />
          </CardContent>
        </Card>
        
        <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Ou</span>
            <div className="flex-grow border-t border-muted"></div>
        </div>

        <Card>
            <CardContent className="pt-6">
                <QrCodeReader />
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
