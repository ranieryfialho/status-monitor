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

  if (login.includes('@')) {
    const admin = await prisma.admin.findUnique({
      where: { email: login }
    })

    if (admin) {
      const isPasswordValid = await compare(password, admin.password)

      if (isPasswordValid) {
        (await cookies()).set('admin_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
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

      (await cookies()).delete('admin_session')
      
      redirect(`/dashboard/${client.slug}`)
    }
  }

  return { error: true, message: 'Credenciais inválidas. Tente novamente.' }
}

export async function logoutAction() {
  (await cookies()).delete('admin_session')
  redirect('/login')
}