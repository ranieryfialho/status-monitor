'use server'

import { redirect } from 'next/navigation'
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

  const client = getClientByCode(token)

  if (!client) {
    return { error: true, message: 'Token de acesso inválido.' }
  }

  redirect(`/dashboard/${client.slug}`)
}