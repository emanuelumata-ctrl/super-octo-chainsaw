'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Calendar, Briefcase } from 'lucide-react';
import type { User } from '@/lib/types';
import { EditProfileForm } from './edit-profile-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileCardProps {
  user: User | null;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Complete seu Perfil</CardTitle>
                <CardDescription>
                    Para começar, por favor, preencha suas informações.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <EditProfileForm 
                    user={{ 
                        id: '', // Will be set by session
                        name: '', 
                        email: '', 
                        jobTitle: '', 
                        admissionDate: '',
                        registration: '',
                        avatarUrl: 'https://picsum.photos/seed/1/200/200' 
                    }} 
                    isNewUser={true}
                    onFormSubmit={() => {}} 
                />
            </CardContent>
        </Card>
    )
  }
  
  if (!user.id) {
    return (
        <Card>
            <CardHeader><CardTitle>Meu Perfil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="text-center w-full space-y-2">
                        <Skeleton className="h-6 w-3/4 mx-auto" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    )
  }


  const formattedAdmissionDate = user.admissionDate ? new Date(user.admissionDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não definida';

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
              <span>{user.jobTitle || 'Cargo não definido'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Admitido em: {formattedAdmissionDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
                Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
            </DialogDescription>
        </DialogHeader>
        <EditProfileForm user={user} onFormSubmit={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}