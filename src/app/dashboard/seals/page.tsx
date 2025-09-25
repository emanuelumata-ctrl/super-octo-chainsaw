'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { QrCodeReader } from '@/components/qrcode-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export default function SealsPage() {
  const totalSeals = 20;
  const [unlockedSeals, setUnlockedSeals] = useState<number[]>([]);

  const handleSealUnlock = (qrCodeData: string) => {
    // A lógica pode ser expandida para validar o qrCodeData se necessário
    setUnlockedSeals((prevUnlocked) => {
      const nextSealId = prevUnlocked.length + 1;
      if (nextSealId <= totalSeals && !prevUnlocked.includes(nextSealId)) {
        return [...prevUnlocked, nextSealId];
      }
      return prevUnlocked;
    });
  };

  const handleClearSeals = () => {
    setUnlockedSeals([]);
  };

  const qrCodeImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/caminho-conhecimento.firebasestorage.app/o/1_20250617_121812_0000.jpg?alt=media&token=a93802b3-5b0f-4150-a3a8-a71d1a3dafc3';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Selos de Conquista"
        description="Colete todos os selos completando os treinamentos e escaneando os QR codes."
      >
        <Button variant="destructive" onClick={handleClearSeals}>
          <Trash className="mr-2 h-4 w-4" />
          Limpar Selos
        </Button>
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Meus Selos</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5">
                {Array.from({ length: totalSeals }, (_, i) => i + 1).map(
                  (sealId) => {
                    const isUnlocked = unlockedSeals.includes(sealId);
                    return (
                      <div
                        key={sealId}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-full border-4 transition-all ${
                          isUnlocked
                            ? 'border-primary bg-primary/10'
                            : 'border-dashed bg-card'
                        }`}
                      >
                        <div
                          className={`flex h-full w-full items-center justify-center rounded-full overflow-hidden ${
                            !isUnlocked ? 'bg-muted/50' : ''
                          }`}
                        >
                          {isUnlocked ? (
                             <Image
                                src={qrCodeImageUrl}
                                alt={`Selo ${sealId} Desbloqueado`}
                                fill
                                className="object-cover"
                              />
                          ) : (
                            <span className="text-3xl font-bold text-muted-foreground">
                              {sealId}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="pt-6">
            <QrCodeReader
              onQrCodeScan={handleSealUnlock}
              title="Escanear Selo"
              description="Aponte a câmera para um QR code de selo para desbloqueá-lo."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
