import { getServerSession } from 'next-auth/next'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function requireAdmin() {
  const session = await getSession()
  
  if (!session || (session.user as any)?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  
  return session
}
