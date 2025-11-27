'use server'

import { revalidatePath } from "next/cache"
import { CLIENTS, ClientUser, SiteConfig } from "@/lib/clients"

// --- AÇÃO 1: ADICIONAR NOVO CLIENTE (USADO NO ADMIN) ---
export async function addClientAction(formData: FormData) {
  // Simula delay de rede para ver o loading visual
  await new Promise(resolve => setTimeout(resolve, 1000))

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const accessCode = formData.get("accessCode") as string
  
  // Dados do primeiro site obrigatório
  const siteName = formData.get("siteName") as string
  const siteUrl = formData.get("siteUrl") as string
  const siteToken = formData.get("siteToken") as string

  // Validação básica
  if (!name || !slug || !accessCode || !siteName) {
    return { error: true, message: "Preencha todos os campos obrigatórios" }
  }

  // Cria o novo objeto de cliente
  const newClient: ClientUser = {
    slug,
    name,
    accessCode,
    sites: [
      {
        // Gera um ID simples baseado no nome (ex: "Padaria Central" -> "padaria-central")
        id: siteName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        name: siteName,
        url: siteUrl,
        apiToken: siteToken
      }
    ]
  }

  // Adiciona ao "Banco de Dados" em memória
  CLIENTS.push(newClient)

  // Atualiza a página do admin para mostrar o novo cliente na lista imediatamente
  revalidatePath("/admin")

  return { success: true, message: "Cliente cadastrado com sucesso!" }
}

// --- AÇÃO 2: ADICIONAR NOVO SITE (USADO PELO GESTOR/CLIENTE) ---
export async function addSiteAction(formData: FormData) {
  // Simula delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Precisamos saber QUEM é o dono do site (clientSlug)
  const clientSlug = formData.get("clientSlug") as string
  
  const siteName = formData.get("siteName") as string
  const siteUrl = formData.get("siteUrl") as string
  const siteToken = formData.get("siteToken") as string

  // Validação
  if (!clientSlug || !siteName || !siteUrl) {
    return { error: true, message: "Preencha todos os campos." }
  }

  // 1. Encontra o cliente no "banco"
  const client = CLIENTS.find(c => c.slug === clientSlug)
  
  if (!client) {
    return { error: true, message: "Cliente não encontrado." }
  }

  // 2. Cria o novo objeto de site
  const newSite: SiteConfig = {
    id: siteName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'), // Gera ID seguro
    name: siteName,
    url: siteUrl,
    apiToken: siteToken || 'sem-token' // Token opcional caso ainda não tenha instalado
  }

  // 3. Adiciona na lista de sites desse cliente específico
  client.sites.push(newSite)

  // 4. Atualiza a tela de lista de sites para mostrar o novo cartão imediatamente
  revalidatePath(`/dashboard/${clientSlug}`)

  return { success: true, message: "Site adicionado com sucesso!" }
}