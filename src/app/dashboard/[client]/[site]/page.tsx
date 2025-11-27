import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { fetchSiteData } from "../lib/api"
import { DashboardView } from "../components/dashboard-view"
import { WPMonitorResponse, UpdateLog } from "@/types/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Interface estendida para suportar status de erro explícito
export interface DashboardData extends WPMonitorResponse {
  status: "online" | "offline";
  lastCheck: string;
}

// Dados de Fallback (Vazio se der erro)
const MOCK_DATA: DashboardData = {
  status: "offline",
  lastCheck: "-",
  sistema: {
    nome_site: "Conexão Falhou",
    url: "#",
    wp_version: "-",
    php: "-",
    ip: "-",
  },
  logs_recentes: [],
  backup: { ativo: false }
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ client: string; site: string }>
}) {
  const { client: clientSlug, site: siteId } = await params
  
  // 1. Busca o cliente e seus sites no Banco de Dados
  const clientUser = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { sites: true }
  })
  
  if (!clientUser) notFound()

  // 2. Encontra o site específico
  const siteConfig = clientUser.sites.find(s => s.id === siteId)
  if (!siteConfig) notFound()

  // 3. Tenta buscar dados reais (Server Side - Carregamento Inicial)
  const apiData = await fetchSiteData(clientSlug, siteId)
  
  let finalData: DashboardData;

  if (!apiData) {
    // CENÁRIO DE ERRO (SITE OFFLINE NO INÍCIO)
    finalData = {
      ...MOCK_DATA,
      status: "offline",
      lastCheck: new Date().toLocaleTimeString(),
      sistema: { ...MOCK_DATA.sistema, nome_site: siteConfig.name, url: siteConfig.url }
    }
  } else {
    // CENÁRIO DE SUCESSO
    finalData = {
      ...apiData,
      status: "online",
      lastCheck: new Date().toLocaleTimeString()
    }
  }

  return (
    <div>
        {/* Botão de Voltar se houver múltiplos sites */}
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
        
        {/* Renderiza a View e passa as credenciais para o Monitor Real-Time */}
        <DashboardView 
            clientName={siteConfig.name} 
            data={finalData} 
            siteCredentials={{
                url: siteConfig.url,
                token: siteConfig.apiToken
            }}
        />
    </div>
  )
}