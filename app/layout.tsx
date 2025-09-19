'use client';

import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ maxWidth: 980, margin: '0 auto', padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 18, margin: 0 }}>Folio &amp; Docket — Client Portal</h1>
            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <SignedIn>
                <a href="/dashboard">Summary</a>
                <a href="/documents">Documents</a>
                <a href="/requests">Requests</a>
                <UserButton afterSignOutUrl="/sign-in" />
              </SignedIn>
              <SignedOut>
                {/* Use supported props: signInUrl/afterSignInUrl */}
                <SignInButton mode="redirect" signInUrl="/sign-in" afterSignInUrl="/dashboard" />
              </SignedOut>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

