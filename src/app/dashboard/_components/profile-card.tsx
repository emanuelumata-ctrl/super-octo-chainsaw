'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Calendar, Briefcase } from 'lucide-react';
import type { User } from '@/lib/types';
import { EditProfileForm } from './edit-profile-form';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formattedAdmissionDate = new Date(user.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR');

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Meu Perfil</CardTitle>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar Perfil</span>
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{user.jobTitle}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Admitido em: {formattedAdmissionDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <DialogContent>
        <EditProfileForm user={user} onFormSubmit={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
