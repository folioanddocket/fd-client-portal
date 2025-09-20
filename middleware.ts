import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)", "/favicon.ico"]
});

// Run on everything except Next assets/files
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
