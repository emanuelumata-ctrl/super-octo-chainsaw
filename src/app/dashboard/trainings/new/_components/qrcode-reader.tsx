'use client';

import { useEffect, useRef, useState } from 'react';
import { QrCode } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function QrCodeReader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Dispositivo Incompatível',
          description: 'Seu navegador não suporta o acesso à câmera.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à Câmera Negado',
          description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador para usar esta funcionalidade.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);

  return (
    <div className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
            <QrCode className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-medium">Escanear QR Code do Treinamento</h3>
            <p className="text-sm text-muted-foreground">
                Posicione o QR code do treinamento em frente à câmera.
            </p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            {hasCameraPermission === false && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Alert variant="destructive" className="max-w-sm">
                        <AlertTitle>Câmera Indisponível</AlertTitle>
                        <AlertDescription>
                            Não foi possível acessar a câmera. Verifique as permissões no seu navegador.
                        </AlertDescription>
                    </Alert>
                 </div>
            )}
        </div>
    </div>
  );
}
