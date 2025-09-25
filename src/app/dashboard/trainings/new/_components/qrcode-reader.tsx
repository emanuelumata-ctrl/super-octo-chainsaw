'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { QrCode } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QrCodeReaderProps {
    onQrCodeScan: (data: any) => void;
}

export function QrCodeReader({ onQrCodeScan }: QrCodeReaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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
                    try {
                        // Tenta analisar como JSON primeiro
                        const jsonData = JSON.parse(code.data);
                        onQrCodeScan(jsonData);
                        toast({
                            title: 'QR Code Lido com Sucesso!',
                            description: 'Os dados do treinamento foram preenchidos.',
                        });
                    } catch (e) {
                        // Se não for JSON, trate como texto com chave-valor
                        const lines = code.data.split('\n');
                        const data: any = {};
                        const keyMapping: { [key: string]: string } = {
                          'Título': 'title',
                          'Nome do Treinador': 'trainerName',
                          'Data de treinamento': 'trainingDate',
                          'Horas de treinamento': 'trainingHours',
                        };

                        lines.forEach(line => {
                            const parts = line.split(':');
                            if (parts.length > 1) {
                                const key = parts[0].trim();
                                const value = parts.slice(1).join(':').trim();
                                const mappedKey = keyMapping[key];
                                if (mappedKey) {
                                    if(mappedKey === 'trainingDate') {
                                        // Formato esperado DD/MM/YYYY para YYYY-MM-DD
                                        const dateParts = value.split('/');
                                        if (dateParts.length === 3) {
                                            data[mappedKey] = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                                        }
                                    } else {
                                        data[mappedKey] = value;
                                    }
                                }
                            }
                        });

                        if (Object.keys(data).length > 0) {
                            onQrCodeScan(data);
                            toast({
                                title: 'QR Code Lido com Sucesso!',
                                description: 'Os dados do treinamento foram preenchidos.',
                            });
                        } else {
                            // Fallback se o formato não for reconhecido
                            onQrCodeScan({ title: code.data });
                            toast({
                                title: 'QR Code Lido!',
                                description: 'O título foi preenchido, mas o formato completo não foi reconhecido.',
                            });
                        }
                    }
                    
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

  }, [toast, onQrCodeScan]);

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
        </div>
    </div>
  );
}
