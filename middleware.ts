import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware({
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)"]
});

export const config = {
  // run on everything except static assets & _next
  matcher: ["/((?!_next|.*\\..*).*)"]
};
