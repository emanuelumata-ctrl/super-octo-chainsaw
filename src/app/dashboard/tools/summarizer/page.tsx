import { PageHeader } from '@/components/page-header';
import { SummarizerForm } from './_components/summarizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function SummarizerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resumidor de Conteúdo com IA"
        description="Cole qualquer texto de documento para obter um resumo conciso."
      />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SummarizerForm />
        </div>
        <div className="lg:col-span-1">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Como funciona</h3>
                  <p className="text-sm text-muted-foreground">
                    Nosso modelo de IA lê o texto que você fornece e extrai os pontos-chave, criando um resumo curto e fácil de ler. É perfeito para entender rapidamente longos documentos de treinamento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
