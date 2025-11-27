import { notFound } from "next/navigation"
import { CLIENTS } from "@/lib/clients"
import { fetchSiteData } from "../lib/api"
import { DashboardView } from "../components/dashboard-view"
import { WPMonitorResponse } from "@/types/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface DashboardData extends WPMonitorResponse {
  analytics: { name: string; atual: number; anterior: number }[];
}

const MOCK_DATA: DashboardData = {
  sistema: {
    nome_site: "Demo Site",
    url: "https://demo.com",
    wp_version: "6.8.3",
    php: "8.1.0",
    ip: "192.168.1.1",
  },
  logs_recentes: [
    { plugin: "Elementor", versao: "3.20.0", data: "2024-03-20 10:00:00" },
    { plugin: "WP Rocket", versao: "3.15.8", data: "2024-03-19 14:30:00" },
  ],
  backup: { ativo: true },
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
  params: Promise<{ client: string; site: string }>
}) {
  const { client: clientSlug, site: siteId } = await params
  
  const clientUser = CLIENTS.find((c) => c.slug === clientSlug)
  if (!clientUser) notFound()

  const siteConfig = clientUser.sites.find(s => s.id === siteId)
  if (!siteConfig) notFound()

  let data = (await fetchSiteData(clientSlug, siteId)) as unknown as DashboardData
  
  if (!data) {
    data = { 
        ...MOCK_DATA, 
        sistema: { ...MOCK_DATA.sistema, nome_site: siteConfig.name, url: siteConfig.url }
    }
  } else {
    data = { ...data, analytics: MOCK_DATA.analytics }
  }

  return (
    <div>
        {/* Botão de Voltar condicional */}
        {clientUser.sites.length > 1 && (
            <div className="p-4 md:p-8 pb-0">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                    <Link href={`/dashboard/${clientSlug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para lista de sites
                    </Link>
                </Button>
            </div>
        )}
        <DashboardView clientName={siteConfig.name} data={data} />
    </div>
  )
}