import { Logo } from '@/components/logo';
import { Award } from 'lucide-react';

interface CertificateProps {
  userName: string;
  trainingTitle: string;
  completionDate: string;
}

export function Certificate({
  userName,
  trainingTitle,
  completionDate,
}: CertificateProps) {
  const formattedDate = new Date(completionDate + 'T00:00:00').toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative aspect-[1.414/1] w-full rounded-lg border-8 border-primary bg-white p-8 shadow-2xl dark:bg-card">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[url('/certificate-bg.svg')] bg-cover opacity-5"></div>
        <div className="flex h-full flex-col items-center justify-between text-center">
        
        <div className="flex items-center gap-4 text-primary">
            <Logo />
        </div>

        <div>
            <p className="font-headline text-lg uppercase tracking-widest text-muted-foreground">
            Certificado de Conclusão
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Este certificado é orgulhosamente apresentado a</p>
            <h1 className="mt-2 font-headline text-5xl font-bold text-primary">
            {userName}
            </h1>
        </div>

        <div>
            <p className="text-sm text-muted-foreground">
            Por concluir com sucesso o módulo de treinamento
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
            {trainingTitle}
            </h2>
        </div>

        <div className="w-full">
            <div className="mx-auto flex max-w-md items-center justify-between">
            <div className="w-1/2 border-t pt-2 text-left">
                <p className="text-xs text-muted-foreground">Data de Conclusão</p>
                <p className="text-sm font-semibold">{formattedDate}</p>
            </div>
            <div className="w-1/2 border-t pt-2 text-right">
                <p className="text-xs text-muted-foreground">Assinatura</p>
                <p className="font-serif text-lg italic text-primary">Skillscribe</p>
            </div>
            </div>
        </div>
        </div>
        <Award className="absolute bottom-6 right-6 h-16 w-16 text-primary/20" strokeWidth={1} />
    </div>
  );
}
