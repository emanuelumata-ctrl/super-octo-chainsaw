import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { trainings, enrollments } from '@/lib/data';
import { Eye, PlusCircle } from 'lucide-react';

export default function TrainingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Módulos de Treinamento"
        description={`Gerencie os ${trainings.length} módulos de treinamento disponíveis.`}
      >
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Treinamento
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Usuários Inscritos</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => {
                const enrolledCount = enrollments.filter(
                  (e) => e.trainingId === training.id
                ).length;
                return (
                  <TableRow key={training.id}>
                    <TableCell className="font-medium">{training.title}</TableCell>
                    <TableCell>{enrolledCount}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/trainings/${training.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver Detalhes</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
