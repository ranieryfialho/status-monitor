'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// --- AÇÃO 1: ADICIONAR NOVO CLIENTE (ADMIN) ---
export async function addClientAction(formData: FormData) {
  // Pega o ID do Admin logado para vincular o cliente a ele
  const adminId = (await cookies()).get('admin_session')?.value

  if (!adminId) {
    return { error: true, message: "Sessão expirada. Faça login novamente." }
  }

  // Simula delay
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
    // Cria Cliente vinculado ao Admin + Primeiro Site
    await prisma.client.create({
      data: {
        name,
        slug,
        accessCode,
        adminId: adminId, // <--- ESSA LINHA É OBRIGATÓRIA AGORA
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
    return { error: true, message: "Erro ao criar. Verifique se o Login (slug) já existe." }
  }
}

// --- AÇÃO 2: ADICIONAR NOVO SITE (ADMIN) ---
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
    // 1. Encontra o cliente
    const client = await prisma.client.findUnique({
      where: { slug: clientSlug }
    })

    if (!client) {
      return { error: true, message: "Cliente não encontrado." }
    }

    // 2. Cria o novo site vinculado ao cliente
    await prisma.site.create({
      data: {
        name: siteName,
        slug: siteName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        url: siteUrl,
        apiToken: siteToken || 'sem-token',
        clientId: client.id
      }
    })

    revalidatePath("/admin")
    revalidatePath(`/dashboard/${clientSlug}`)
    
    return { success: true, message: "Site adicionado com sucesso!" }

  } catch (error) {
    console.error("Erro ao adicionar site:", error)
    return { error: true, message: "Erro ao adicionar site." }
  }
}

// ... (Mantenha as funções deleteClientAction e deleteSiteAction aqui embaixo também, se já tiver colocado)
// --- AÇÃO: DELETAR CLIENTE ---
export async function deleteClientAction(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  if (!clientId) return;
  try {
    await prisma.client.delete({ where: { id: clientId } });
    revalidatePath("/admin");
  } catch (error) { console.error(error); }
}

// --- AÇÃO: DELETAR SITE ---
export async function deleteSiteAction(formData: FormData) {
  const siteId = formData.get("siteId") as string;
  if (!siteId) return;
  try {
    await prisma.site.delete({ where: { id: siteId } });
    revalidatePath("/admin");
  } catch (error) { console.error(error); }
}