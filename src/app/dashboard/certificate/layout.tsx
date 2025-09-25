import type { ReactNode } from 'react';

export default function CertificateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      {children}
    </div>
  );
}
