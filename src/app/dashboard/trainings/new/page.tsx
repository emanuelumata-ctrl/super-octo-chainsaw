'use client';

import { PageHeader } from '@/components/page-header';
import { TrainingForm } from './_components/training-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCodeReader } from './_components/qrcode-reader';
import { useState } from 'react';

export default function NewTrainingPage() {
  const [qrData, setQrData] = useState(null);

  const handleQrScan = (data: any) => {
    setQrData(data);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Criar Novo Treinamento"
        description="Preencha o formulário ou escaneie um QR code para adicionar um novo módulo."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <TrainingForm initialData={qrData} />
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="pt-6">
                <QrCodeReader onQrCodeScan={handleQrScan} />
            </CardContent>
        </Card>
      </div>

    </div>
  );
}