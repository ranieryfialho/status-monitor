import prisma from "@/lib/prisma";
import { WPMonitorResponse } from "@/types/api";

export async function fetchSiteData(clientSlug: string, siteId: string): Promise<WPMonitorResponse | null> {
  
  // 1. Busca o cliente no Banco de Dados
  const client = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { sites: true } // Traz os sites juntos
  });

  if (!client) return null;

  // 2. Encontra o site específico dentro da lista desse gestor
  // (Como o ID agora é um CUID do banco ou o slug, vamos buscar pelo slug do site que definimos na criação)
  const site = client.sites.find((s) => s.slug === siteId || s.id === siteId);
  
  if (!site) return null;

  try {
    // 3. Conecta no WordPress real usando os dados do banco
    const res = await fetch(`${site.url}/wp-json/status-monitor/v1/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Status-Token': site.apiToken,
      },
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error(`Erro ao conectar com ${site.name}:`, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Erro de conexão:", error);
    return null;
  }
}