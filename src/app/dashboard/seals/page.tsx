'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { QrCodeReader } from '@/components/qrcode-reader';
import { Card, CardContent } from '@/components/ui/card';

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

  const qrCodeImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/caminho-conhecimento.firebasestorage.app/o/IMG-20250617-WA0039(1).jpg?alt=media&token=05400221-2e4e-4d20-8a8f-39aa64eb4691';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Selos de Conquista"
        description="Colete todos os selos completando os treinamentos e escaneando os QR codes."
      />

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
