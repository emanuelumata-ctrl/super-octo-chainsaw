import { PageHeader } from '@/components/page-header';
import { SummarizerForm } from './_components/summarizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function SummarizerPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Content Summarizer"
        description="Paste any document text to get a concise summary."
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
                  <h3 className="font-semibold">How it works</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI model reads the text you provide and extracts the key points, creating a short and easy-to-read summary. It's perfect for quickly understanding long training documents.
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
