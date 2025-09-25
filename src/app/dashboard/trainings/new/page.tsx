'use client';

import { PageHeader } from '@/components/page-header';
import { TrainingForm } from './_components/training-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCodeReader } from './_components/qrcode-reader';
import { useState } from 'react';

export default function NewTrainingPage() {
  const [isQrCodeScanned, setIsQrCodeScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);


  const handleQrScan = (data: string) => {
    setQrCodeData(data);
    setIsQrCodeScanned(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registrar Novo Treinamento"
        description="Preencha o formulário e valide com o QR code para registrar."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <TrainingForm isQrCodeScanned={isQrCodeScanned} qrCodeData={qrCodeData} />
          </CardContent>
        </Card>
        
        <Card>
            <CardContent className="pt-6">
                <QrCodeReader onQrCodeScan={handleQrScan} isScanned={isQrCodeScanned} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
