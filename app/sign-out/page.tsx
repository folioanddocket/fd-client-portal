"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const r = useRouter();
  useEffect(() => { signOut(() => r.push("/sign-in")); }, [signOut, r]);
  return null;
}
