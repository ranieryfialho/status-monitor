import prisma from "@/lib/prisma";
import { WPMonitorResponse } from "@/types/api";

export async function fetchSiteData(clientSlug: string, siteId: string): Promise<WPMonitorResponse | null> {
  
  const client = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { sites: true }
  });

  if (!client) return null;

  const site = client.sites.find((s) => s.slug === siteId || s.id === siteId);
  if (!site) return null;

  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${site.url}/wp-json/status-monitor/v1/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Status-Token': site.apiToken,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Erro HTTP ao conectar com ${site.name}:`, res.statusText);
      return null;
    }

    return await res.json();

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout: ${site.name} demorou demais para responder.`);
    } else {
      console.error("Erro de conexão:", error);
    }
    return null;
  }
}