import { CLIENTS } from "@/lib/clients";
import { WPMonitorResponse } from "@/types/api";

export async function fetchClientData(clientSlug: string): Promise<WPMonitorResponse | null> {
  const client = CLIENTS.find((c) => c.slug === clientSlug);

  if (!client) return null;

  try {
    const res = await fetch(`${client.apiUrl}/wp-json/status-monitor/v1/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Status-Token': client.apiToken,
      },
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error(`Erro ao conectar com ${client.name}:`, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Erro de conexão:", error);
    return null;
  }
}