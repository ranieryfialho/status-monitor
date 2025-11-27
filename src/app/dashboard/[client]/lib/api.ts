import { CLIENTS } from "@/lib/clients";
import { WPMonitorResponse } from "@/types/api";

export async function fetchSiteData(clientSlug: string, siteId: string): Promise<WPMonitorResponse | null> {
  // 1. Encontra o gestor
  const client = CLIENTS.find((c) => c.slug === clientSlug);
  if (!client) return null;

  // 2. Encontra o site específico dentro da lista desse gestor
  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return null;

  try {
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