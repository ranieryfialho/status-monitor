'use server'

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Importamos o banco real

// --- AÇÃO 1: ADICIONAR NOVO CLIENTE ---
export async function addClientAction(formData: FormData) {
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
    // Salva no Supabase via Prisma
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

// --- AÇÃO 2: ADICIONAR NOVO SITE ---
export async function addSiteAction(formData: FormData) {
  const clientSlug = formData.get("clientSlug") as string
  const siteName = formData.get("siteName") as string
  const siteUrl = formData.get("siteUrl") as string
  const siteToken = formData.get("siteToken") as string

  if (!clientSlug || !siteName || !siteUrl) {
    return { error: true, message: "Preencha todos os campos." }
  }

  try {
    // 1. Busca o ID do cliente pelo Slug
    const client = await prisma.client.findUnique({
      where: { slug: clientSlug }
    })

    if (!client) {
      return { error: true, message: "Cliente não encontrado." }
    }

    // 2. Cria o site vinculado a esse ID
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