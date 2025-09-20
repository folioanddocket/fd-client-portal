import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Run on everything except Next assets/static files
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
