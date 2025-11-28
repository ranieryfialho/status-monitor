'use server'

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

// 1. Definimos o tipo exato
export type ChangePasswordState = {
  message: string
  error: boolean
  success: boolean
}

// 2. Aplicamos o tipo no retorno da função (Promise<ChangePasswordState>)
export async function changePasswordAction(
  prevState: ChangePasswordState, 
  formData: FormData
): Promise<ChangePasswordState> {
  
  await new Promise(resolve => setTimeout(resolve, 500))

  const type = formData.get("type") as string
  const identifier = formData.get("identifier") as string
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  if (!currentPassword || !newPassword) {
    // 3. Retornamos o objeto COMPLETO (sem omitir propriedades)
    return { error: true, message: "Preencha todos os campos.", success: false }
  }

  try {
    if (type === 'admin') {
      const adminSession = (await cookies()).get('admin_session')
      const adminId = adminSession?.value

      if (!adminId) return { error: true, message: "Sessão expirada.", success: false }

      const admin = await prisma.admin.findUnique({ where: { id: adminId } })
      if (!admin) return { error: true, message: "Administrador não encontrado.", success: false }

      const isValid = await compare(currentPassword, admin.password)
      if (!isValid) return { error: true, message: "Senha atual incorreta.", success: false }

      const hashedPassword = await hash(newPassword, 10)
      await prisma.admin.update({
        where: { id: adminId },
        data: { password: hashedPassword }
      })

    } else {
      if (!identifier) return { error: true, message: "Identificador do cliente não fornecido.", success: false }

      const client = await prisma.client.findUnique({ where: { slug: identifier } })
      if (!client) return { error: true, message: "Cliente não encontrado.", success: false }

      if (client.accessCode !== currentPassword) {
        return { error: true, message: "Código de acesso atual incorreto.", success: false }
      }

      await prisma.client.update({
        where: { slug: identifier },
        data: { accessCode: newPassword }
      })
    }

    revalidatePath("/")
    // 4. Retorno completo de sucesso
    return { success: true, message: "Alteração realizada com sucesso!", error: false }

  } catch (error) {
    console.error("Erro ao trocar senha:", error)
    return { error: true, message: "Erro interno ao atualizar.", success: false }
  }
}