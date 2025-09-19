import { NextResponse } from "next/server";

// Temporary no-op middleware: no auth at the edge, keeps builds green.
export default function middleware() {
  return NextResponse.next();
}

// Disable matching so it's effectively off
export const config = { matcher: [] };
