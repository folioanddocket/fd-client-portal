export const dynamic = "force-dynamic";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata = { title: "Folio & Docket — Client Portal" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "Inter, Arial, sans-serif"}}>
          <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h1 style={{fontSize:18,margin:0}}>Folio & Docket — Client Portal</h1>
            <nav style={{display:"flex",gap:12}}>
              <SignedIn>
                <a href="/dashboard">Summary</a>
                <a href="/documents">Documents</a>
                <a href="/requests">Requests</a>
                <a href="/sign-out">Sign out</a>
              </SignedIn>
              <SignedOut>
                <a href="/sign-in">Sign in</a>
              </SignedOut>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
