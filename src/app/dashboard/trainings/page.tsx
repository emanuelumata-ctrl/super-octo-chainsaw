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
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { trainings, enrollments } from '@/lib/data';
import { Eye, PlusCircle } from 'lucide-react';

export default function TrainingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Training Modules"
        description={`Manage the ${trainings.length} available training modules.`}
      >
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Training
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Enrolled Users</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
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
                    <TableCell>
                      <Badge variant="secondary">{training.category}</Badge>
                    </TableCell>
                    <TableCell>{enrolledCount}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/dashboard/trainings/${training.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
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
