'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import type { User, Enrollment, EnrollmentStatus } from '@/lib/types';
import { updateUserEnrollment, updateEnrollmentStatus } from '@/lib/actions';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Award, ChevronsUpDown, MoreHorizontal } from 'lucide-react';

interface EnrollmentManagerProps {
  allUsers: User[];
  trainingId: string;
  initialEnrollments: Enrollment[];
}

export function EnrollmentManager({
  allUsers,
  trainingId,
  initialEnrollments,
}: EnrollmentManagerProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  let [isPending, startTransition] = useTransition();

  const handleEnrollmentChange = (user: User, isEnrolled: boolean) => {
    startTransition(async () => {
      await updateUserEnrollment(trainingId, user.id, isEnrolled);
      if (isEnrolled) {
        setEnrollments((prev) => prev.filter((e) => e.userId !== user.id));
      } else {
        setEnrollments((prev) => [...prev, { userId: user.id, trainingId, status: 'Não Iniciado' }]);
      }
    });
  };

  const handleStatusChange = (userId: string, status: EnrollmentStatus) => {
    startTransition(async () => {
      await updateEnrollmentStatus(trainingId, userId, status);
      setEnrollments((prev) =>
        prev.map((e) =>
          e.userId === userId
            ? {
                ...e,
                status,
                completionDate: status === 'Concluído' ? new Date().toISOString().split('T')[0] : undefined,
              }
            : e
        )
      );
    });
  };

  const statusColors: Record<EnrollmentStatus, 'default' | 'secondary' | 'outline'> = {
    'Concluído': 'default',
    'Em Progresso': 'secondary',
    'Não Iniciado': 'outline',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Inscrito</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allUsers.map((user) => {
          const enrollment = enrollments.find((e) => e.userId === user.id);
          const isEnrolled = !!enrollment;

          return (
            <TableRow key={user.id} className={isPending ? 'opacity-50' : ''}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>
                {isEnrolled ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-[150px] justify-between">
                         <Badge variant={statusColors[enrollment.status]}>{enrollment.status}</Badge>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[150px]">
                      {(['Não Iniciado', 'Em Progresso', 'Concluído'] as EnrollmentStatus[]).map((status) => (
                        <DropdownMenuItem key={status} onSelect={() => handleStatusChange(user.id, status)}>
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Badge variant="destructive">Não Inscrito</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                 {enrollment?.status === 'Concluído' && (
                     <Button asChild variant="ghost" size="icon" title="Ver Certificado">
                       <Link href={`/dashboard/certificate/${user.id}/${trainingId}`}>
                         <Award className="h-4 w-4 text-primary" />
                       </Link>
                     </Button>
                  )}
                  <Switch
                    checked={isEnrolled}
                    onCheckedChange={() => handleEnrollmentChange(user, isEnrolled)}
                    disabled={isPending}
                    aria-label={`Inscrever ${user.name}`}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
