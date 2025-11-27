'use server'

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addClientAction(formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const accessCode = formData.get("accessCode") as string
  
  const siteName = formData.get("siteName") as string
  const siteUrl = formData.get("siteUrl") as string
  const siteToken = formData.get("siteToken") as string

  if (!name || !slug || !accessCode || !siteName) {
    return { error: true, message: "Preencha todos os campos obrigatórios" }
  }

  try {
    await prisma.client.create({
      data: {
        name,
        slug,
        accessCode,
        sites: {
          create: {
            slug: siteName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
            name: siteName,
            url: siteUrl,
            apiToken: siteToken
          }
        }
      }
    })

    revalidatePath("/admin")
    return { success: true, message: "Cliente cadastrado com sucesso!" }
    
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { error: true, message: "Erro ao criar cliente. Verifique se o slug já existe." }
  }
}

export async function addSiteAction(formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const clientSlug = formData.get("clientSlug") as string
  const siteName = formData.get("siteName") as string
  const siteUrl = formData.get("siteUrl") as string
  const siteToken = formData.get("siteToken") as string

  if (!clientSlug || !siteName || !siteUrl) {
    return { error: true, message: "Preencha todos os campos." }
  }

  try {
    const client = await prisma.client.findUnique({
      where: { slug: clientSlug }
    })

    if (!client) {
      return { error: true, message: "Cliente não encontrado." }
    }

    await prisma.site.create({
      data: {
        name: siteName,
        slug: siteName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        url: siteUrl,
        apiToken: siteToken || 'sem-token',
        clientId: client.id
      }
    })

    revalidatePath(`/dashboard/${clientSlug}`)
    return { success: true, message: "Site adicionado com sucesso!" }

  } catch (error) {
    console.error("Erro ao adicionar site:", error)
    return { error: true, message: "Erro ao adicionar site." }
  }
}