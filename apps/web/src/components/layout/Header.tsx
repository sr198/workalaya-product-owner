'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="flex h-14 items-center justify-between px-6">
        <span className="text-lg font-semibold">Workalaya</span>
        {session?.user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
            >
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}