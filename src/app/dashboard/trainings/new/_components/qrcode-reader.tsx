'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { QrCode, CheckCircle } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QrCodeReaderProps {
    onQrCodeScan: (data: string) => void;
    isScanned: boolean;
}

export function QrCodeReader({ onQrCodeScan, isScanned }: QrCodeReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanned) return;

    let animationFrameId: number;
    let stream: MediaStream | null = null;

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
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          animationFrameId = requestAnimationFrame(tick);
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
    
    const tick = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code) {
                    onQrCodeScan(code.data);
                    toast({
                        title: 'QR Code Validado!',
                        description: 'Agora você pode registrar o treinamento.',
                    });
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                    cancelAnimationFrame(animationFrameId);
                    return;
                }
            }
        }
        animationFrameId = requestAnimationFrame(tick);
    };

    getCameraPermission();
    
    return () => {
        cancelAnimationFrame(animationFrameId);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast, onQrCodeScan, isScanned]);

  return (
    <div className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
            {isScanned ? (
                 <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
                <QrCode className="h-8 w-8 text-primary" />
            )}
            <h3 className="text-lg font-medium">
                {isScanned ? 'QR Code Validado' : 'Validar com QR Code'}
            </h3>
            <p className="text-sm text-muted-foreground">
                {isScanned 
                    ? 'O treinamento foi validado. Clique em "Registrar Treinamento" para concluir.'
                    : 'Aponte a câmera para o QR code para validar e habilitar o registro.'}
            </p>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            {isScanned ? (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                    <CheckCircle className="h-24 w-24 text-green-500 opacity-50" />
                </div>
            ) : (
                <>
                    <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
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
                </>
            )}
        </div>
    </div>
  );
}
