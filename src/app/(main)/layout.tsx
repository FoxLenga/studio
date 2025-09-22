'use client';

import { AuthGuard } from '@/hooks/use-auth';
import { AppHeader } from '@/components/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
