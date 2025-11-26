import { notFound } from "next/navigation"
import { CLIENTS } from "@/lib/clients"
import { fetchClientData } from "./lib/api"
import { DashboardView } from "./components/dashboard-view"
import { WPMonitorResponse } from "@/types/api"

interface DashboardData extends WPMonitorResponse {
  analytics: {
    name: string;
    atual: number;
    anterior: number;
  }[];
}

// DADOS MOCKADOS
const MOCK_DATA: DashboardData = {
  sistema: {
    nome_site: "Dra. Alice Cunha",
    url: "https://dralaicecunha.com.br",
    wp_version: "6.8.3",
    php: "8.1.0",
    ip: "192.168.1.1",
  },
  logs_recentes: [
    { plugin: "Elementor", versao: "3.20.0", data: "2024-03-20 10:00:00" },
    { plugin: "WP Rocket", versao: "3.15.8", data: "2024-03-19 14:30:00" },
    { plugin: "Yoast SEO", versao: "22.3", data: "2024-03-18 09:15:00" },
    { plugin: "WooCommerce", versao: "8.7.0", data: "2024-03-15 11:20:00" },
    { plugin: "Contact Form 7", versao: "5.9", data: "2024-03-10 16:45:00" }
  ],
  backup: { 
    ativo: true 
  },
  analytics: [
    { name: "01/Set", atual: 400, anterior: 240 },
    { name: "05/Set", atual: 300, anterior: 139 },
    { name: "10/Set", atual: 200, anterior: 980 },
    { name: "15/Set", atual: 278, anterior: 390 },
    { name: "20/Set", atual: 189, anterior: 480 },
    { name: "25/Set", atual: 239, anterior: 380 },
    { name: "30/Set", atual: 349, anterior: 430 },
  ]
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ client: string }>
}) {
  const { client: clientSlug } = await params
  
  const clientConfig = CLIENTS.find((c) => c.slug === clientSlug)
  
  if (!clientConfig) {
    notFound()
  }

  let data = (await fetchClientData(clientSlug)) as unknown as DashboardData
  
  if (!data) {
    data = MOCK_DATA
  } else {
    data = { ...data, analytics: MOCK_DATA.analytics }
  }

  return <DashboardView clientName={clientConfig.name} data={data} />
}