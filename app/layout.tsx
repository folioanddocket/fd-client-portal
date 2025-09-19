'use client';

import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="site-header">
            <div className="header-inner">
              <h1 className="brand">Folio &amp; Docket — Client Portal</h1>
              <nav className="nav">
                <SignedIn>
                  <a href="/dashboard">Summary</a>
                  <a href="/documents">Documents</a>
                  <a href="/requests">Requests</a>
                  <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
                <SignedOut>
                  <a href="/sign-in" className="btn btn-primary">Sign in</a>
                </SignedOut>
              </nav>
            </div>
          </header>

          <main className="container">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
