import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Users,
} from 'lucide-react';
import { trainings, users, enrollments } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PageHeader } from '@/components/page-header';

export default function DashboardPage() {
  const totalTrainings = trainings.length;
  const totalUsers = users.length;
  const completedEnrollments = enrollments.filter(
    (e) => e.status === 'Completed'
  ).length;
  
  const ongoingTrainings = trainings.filter(t => enrollments.some(e => e.trainingId === t.id && e.status === 'In Progress'));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome, Admin!"
        description="Here's a snapshot of your team's learning journey."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainings}</div>
            <p className="text-xs text-muted-foreground">
              Modules available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Employees in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{completedEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              Across all modules
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 font-headline text-2xl font-semibold">Ongoing Trainings</h2>
        {ongoingTrainings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ongoingTrainings.map((training) => {
              const image = PlaceHolderImages.find(p => p.id === training.coverImageId);
              return (
              <Card key={training.id} className="overflow-hidden">
                <Link href={`/dashboard/trainings/${training.id}`} className="block h-full transition-shadow duration-200 hover:shadow-lg">
                  {image && (
                     <Image
                      src={image.imageUrl}
                      alt={training.title}
                      width={600}
                      height={400}
                      data-ai-hint={image.imageHint}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle>{training.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm text-primary">
                    <span>View Progress</span>
                    <ArrowRight className="h-4 w-4" />
                  </CardContent>
                </Link>
              </Card>
            )})}
          </div>
        ) : (
          <p className="text-muted-foreground">No trainings are currently in progress.</p>
        )}
      </div>
    </div>
  );
}
