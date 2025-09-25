'use client';

import { useState, useTransition } from 'react';
import { summarizeDocumentAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function SummarizerForm() {
  const [documentContent, setDocumentContent] = useState('');
  const [result, setResult] = useState<{ summary: string; error: string }>({ summary: '', error: '' });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const res = await summarizeDocumentAction(documentContent);
      setResult(res);
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documento para Resumir</CardTitle>
          <CardDescription>Cole o conteúdo do seu documento de treinamento abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Comece a colar seu documento aqui... Para melhores resultados, use pelo menos 50 caracteres."
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              rows={10}
              className="resize-y"
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending || !documentContent}>
              {isPending ? 'Resumindo...' : 'Gerar Resumo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {(isPending || result.summary || result.error) && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : result.error ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
