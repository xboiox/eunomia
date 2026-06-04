import bcrypt from "bcrypt";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma/client";
import { getSecurityPolicy, isPasswordExpired } from "@/lib/settings/security";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user?.password) {
          throw new Error("Invalid email or password");
        }

        // Account lockout check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
          throw new Error(`Account is locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`);
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          // Increment failed attempts; lock if threshold reached
          const policy = await getSecurityPolicy();
          const newCount = user.failedLoginAttempts + 1;
          const shouldLock = newCount >= policy.lockoutAttempts;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newCount,
              lockedUntil: shouldLock
                ? new Date(Date.now() + policy.lockoutMinutes * 60 * 1000)
                : user.lockedUntil,
            },
          });

          if (shouldLock) {
            throw new Error(`Too many failed attempts. Account locked for ${policy.lockoutMinutes} minute${policy.lockoutMinutes === 1 ? "" : "s"}.`);
          }

          const remaining = policy.lockoutAttempts - newCount;
          throw new Error(`Invalid email or password. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout.`);
        }

        // Successful login — reset failed attempts and lockout
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null },
        });

        return user;
      },
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        // port 465 requires SSL; 587 uses STARTTLS (Nodemailer default)
        secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        const [dbUser, policy] = await Promise.all([
          prisma.user.findUnique({
            where: { id: user.id },
            select: {
              isSuperAdmin: true,
              mustChangePassword: true,
              passwordChangedAt: true,
              createdAt: true,
            },
          }),
          getSecurityPolicy(),
        ]);

        const expired = dbUser
          ? isPasswordExpired(policy, dbUser.passwordChangedAt, dbUser.createdAt)
          : false;

        token.isSuperAdmin = dbUser?.isSuperAdmin ?? false;
        token.mustChangePassword = (dbUser?.mustChangePassword ?? false) || expired;
      }
      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            isSuperAdmin: token.isSuperAdmin ?? false,
            mustChangePassword: token.mustChangePassword ?? false,
          },
        };
      }
      return session;
    },
  },
};
