'use client';

import { PageHeader } from '@/components/page-header';
import { TrainingForm } from './_components/training-form';
import { Card, CardContent } from '@/components/ui/card';
import { QrCodeReader } from '@/components/qrcode-reader';
import { useState } from 'react';

export default function NewTrainingPage() {
  const [isQrCodeScanned, setIsQrCodeScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);


  const handleQrScan = (data: string) => {
    setQrCodeData(data);
    setIsQrCodeScanned(true);
  };

  const qrCodeImageUrl = 'https://firebasestorage.googleapis.com/v0/b/caminho-conhecimento.firebasestorage.app/o/IMG-20250617-WA0039(1).jpg?alt=media&token=05400221-2e4e-4d20-8a8f-39aa64eb4691';

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
                <QrCodeReader 
                  onQrCodeScan={handleQrScan}
                  isScanned={isQrCodeScanned}
                  scannedImageUrl={qrCodeImageUrl}
                  title="Validar com QR Code"
                  description='Aponte a câmera para o QR code para validar e habilitar o registro.'
                  scannedDescription='O treinamento foi validado. Clique em "Registrar Treinamento" para concluir.'
                />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}