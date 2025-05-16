import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'demo',
      name: 'Demo',
      credentials: {},
      async authorize() {
        // Always return the demo user
        return {
          id: 'demo-user-123',
          name: 'Demo User',
          email: 'demo@example.com',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: 'demo-secret-key',
});

export { handler as GET, handler as POST }; 