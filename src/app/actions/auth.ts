'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getClientByCode } from '@/lib/clients'

export type LoginState = {
  message?: string
  error?: boolean
}

export async function loginAction(prevState: LoginState, formData: FormData) {
  const token = formData.get('token') as string
  
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (!token) {
    return { error: true, message: 'Por favor, digite um token de acesso.' }
  }

  if (token === process.env.ADMIN_SECRET_KEY) {
    (await cookies()).set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    redirect('/admin')
  }

  const client = getClientByCode(token)
  if (!client) {
    return { error: true, message: 'Token de acesso inválido.' }
  }

  (await cookies()).delete('admin_session')
  redirect(`/dashboard/${client.slug}`)
}

export async function logoutAction() {
  (await cookies()).delete('admin_session')
  
  redirect('/login')
}