'use server'

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

// --- AÇÃO 1: ADICIONAR NOVO CLIENTE (ADMIN) ---
export async function addClientAction(formData: FormData) {
  const adminId = (await cookies()).get('admin_session')?.value

  if (!adminId) {
    return { error: true, message: "Sessão expirada. Faça login novamente." }
  }

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
        adminId: adminId,
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

    revalidatePath("/admin")
    revalidatePath(`/dashboard/${clientSlug}`)
    
    return { success: true, message: "Site adicionado com sucesso!" }

  } catch (error) {
    console.error("Erro ao adicionar site:", error)
    return { error: true, message: "Erro ao adicionar site." }
  }
}

// --- AÇÃO 3: EDITAR CLIENTE ---
export async function updateClientAction(formData: FormData) {
  const clientId = formData.get("clientId") as string
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const accessCode = formData.get("accessCode") as string

  if (!clientId || !name || !slug || !accessCode) {
    return { error: true, message: "Preencha todos os campos." }
  }

  try {
    await prisma.client.update({
      where: { id: clientId },
      data: { name, slug, accessCode }
    })
    revalidatePath("/admin")
    return { success: true, message: "Cliente atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return { error: true, message: "Erro ao atualizar. Verifique se o slug já existe." }
  }
}

// --- AÇÃO 4: EDITAR SITE ---
export async function updateSiteAction(formData: FormData) {
  const siteId = formData.get("siteId") as string
  const name = formData.get("name") as string
  const url = formData.get("url") as string
  const apiToken = formData.get("apiToken") as string

  if (!siteId || !name || !url) {
    return { error: true, message: "Preencha os campos obrigatórios." }
  }

  try {
    await prisma.site.update({
      where: { id: siteId },
      data: {
        name,
        url,
        apiToken: apiToken
      }
    })
    revalidatePath("/admin")
    return { success: true, message: "Site atualizado com sucesso!" }
  } catch (error) {
    console.error("Erro ao atualizar site:", error)
    return { error: true, message: "Erro ao atualizar site." }
  }
}

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