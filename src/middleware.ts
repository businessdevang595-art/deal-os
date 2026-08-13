import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/properties/:path*",
    "/buyers/:path*",
    "/site-visits/:path*",
    "/deals/:path*",
    "/settings/:path*",
  ],
};
