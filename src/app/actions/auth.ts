'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import prisma from "@/lib/prisma"
import { compare } from 'bcryptjs'

export type LoginState = {
  message?: string
  error?: boolean
}

export async function loginAction(prevState: LoginState, formData: FormData) {
  const login = formData.get('login') as string
  const password = formData.get('password') as string
  
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!login || !password) {
    return { error: true, message: 'Preencha usuário e senha.' }
  }

  // --- LOGIN ADMIN ---
  if (login.includes('@')) {
    const admin = await prisma.admin.findUnique({
      where: { email: login }
    })

    if (admin) {
      const isPasswordValid = await compare(password, admin.password)

      if (isPasswordValid) {
        (await cookies()).delete('client_session');

        (await cookies()).set('admin_session', admin.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        })
        redirect('/admin')
      }
    }
  }

  const client = await prisma.client.findUnique({
    where: { slug: login }
  })

  if (client) {
    if (client.accessCode === password) {
      (await cookies()).delete('admin_session');

      (await cookies()).set('client_session', client.slug, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // Mantém 30 dias
        path: '/',
      })

      redirect(`/dashboard/${client.slug}`)
    }
  }

  return { error: true, message: 'Credenciais inválidas. Tente novamente.' }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session')
  cookieStore.delete('client_session');
  redirect('/login')
}