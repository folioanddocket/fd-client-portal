'use client';
import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';

export default function SignOutPage() {
  const { signOut } = useClerk();
  useEffect(() => { signOut().then(() => window.location.href = '/sign-in'); }, [signOut]);
  return <p>Signing you out…</p>;
}
