'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, QrCode } from 'lucide-react';
import Image from 'next/image';

import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';

interface QrCodeReaderProps {
    onQrCodeScan: (data: string) => void;
    isScanned?: boolean;
    scannedImageUrl?: string;
    title?: string;
    description?: string;
    scannedDescription?: string;
}

export function QrCodeReader({ 
    onQrCodeScan, 
    isScanned = false, 
    scannedImageUrl,
    title = "Leitor de QR Code",
    description = "Aponte a câmera para o QR code.",
    scannedDescription = "QR Code lido com sucesso!"
}: QrCodeReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient || !isScanningActive || hasCameraPermission === false) return;

    let animationFrameId: number;
    let stream: MediaStream | null = null;
    let isScanning = true;

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
          videoRef.current.onloadedmetadata = () => {
            if(videoRef.current) {
                videoRef.current.play().catch(err => console.error("Falha ao iniciar o vídeo:", err));
                animationFrameId = requestAnimationFrame(tick);
            }
          };
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
        if (!isScanning) return;

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
                    inversionAttempts: 'attemptBoth',
                });

                if (code && code.data) {
                    isScanning = false;
                    onQrCodeScan(code.data);
                    toast({
                        title: 'QR Code Lido!',
                        description: 'Ação registrada com sucesso.',
                    });
                     // Se não for reutilizável, paramos o stream e a varredura
                    if (scannedImageUrl) {
                      setIsScanningActive(false);
                      if (stream) {
                          stream.getTracks().forEach(track => track.stop());
                      }
                      cancelAnimationFrame(animationFrameId);
                      return;
                    }
                    // Se for reutilizável (como na página de selos), esperamos um pouco e continuamos
                    setTimeout(() => { isScanning = true; }, 2000);
                }
            }
        }
        if (isScanning) {
          animationFrameId = requestAnimationFrame(tick);
        }
    };

    getCameraPermission();
    
    return () => {
        isScanning = false;
        cancelAnimationFrame(animationFrameId);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast, onQrCodeScan, isClient, hasCameraPermission, scannedImageUrl, isScanningActive]);

  if (!isClient) {
    return null; 
  }

  const handleActivateScanner = () => {
    setIsScanningActive(true);
  };

  return (
    <div className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
            <QrCode className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-medium">
                {isScanned ? 'Validado' : title}
            </h3>
            <p className="text-sm text-muted-foreground">
                {isScanned 
                    ? scannedDescription
                    : description}
            </p>
        </div>

        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border">
            {isScanned && scannedImageUrl ? (
                 <div className="flex h-full w-full items-center justify-center p-4">
                    <Image 
                        src={scannedImageUrl}
                        alt="QR Code de Validação"
                        fill
                        className="object-contain"
                    />
                 </div>
            ) : isScanningActive ? (
                <>
                    <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                    {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <Alert variant="destructive" className="max-w-sm">
                                <QrCode className="h-4 w-4" />
                                <AlertTitle>Câmera Indisponível</AlertTitle>
                                <AlertDescription>
                                    Não foi possível acessar a câmera. Verifique as permissões no seu navegador e recarregue a página.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <Camera className="h-16 w-16 text-muted-foreground/50" />
                    <Button onClick={handleActivateScanner}>
                        Escanear QR Code
                    </Button>
                </div>
            )}
        </div>
    </div>
  );
}
