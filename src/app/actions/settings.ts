'use server'

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function changePasswordAction(prevState: any, formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 500))

  const type = formData.get("type") as string
  const identifier = formData.get("identifier") as string
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  if (!currentPassword || !newPassword) {
    return { error: true, message: "Preencha todos os campos." }
  }

  try {
    if (type === 'admin') {
      const adminId = (await cookies()).get('admin_session')?.value
      if (!adminId) return { error: true, message: "Sessão expirada." }

      const admin = await prisma.admin.findUnique({ where: { id: adminId } })
      if (!admin) return { error: true, message: "Administrador não encontrado." }

      const isValid = await compare(currentPassword, admin.password)
      if (!isValid) return { error: true, message: "Senha atual incorreta." }

      const hashedPassword = await hash(newPassword, 10)
      await prisma.admin.update({
        where: { id: adminId },
        data: { password: hashedPassword }
      })

    } else {

      const client = await prisma.client.findUnique({ where: { slug: identifier } })
      if (!client) return { error: true, message: "Cliente não encontrado." }

      if (client.accessCode !== currentPassword) {
        return { error: true, message: "Código de acesso atual incorreto." }
      }

      await prisma.client.update({
        where: { slug: identifier },
        data: { accessCode: newPassword }
      })
    }

    revalidatePath("/")
    return { success: true, message: "Alteração realizada com sucesso!" }

  } catch (error) {
    console.error("Erro ao trocar senha:", error)
    return { error: true, message: "Erro interno ao atualizar." }
  }
}