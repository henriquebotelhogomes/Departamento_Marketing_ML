import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/insights/:path*", "/customers/:path*", "/dataset/:path*", "/settings/:path*"],
};
