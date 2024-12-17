import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: 'Ov23liTOwFkKF2jx4Wez',
            clientSecret: 'a75604ee56f36376032ed0124d698141fbc6e0b0',
        }),
    ],
    secret: 'K2UQJqafVY5Lt1brAn9XPEgY6UbjSD8TZjMHWcIc29Q',
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Redirect to /central-free after successful login
            if (url === "/") {
                return `${baseUrl}/central-free`; // Redirect to /central-free after login
            }
            return url; // Default behavior, redirects to the same URL as before
        },
    },
});

export { handler as GET, handler as POST };
