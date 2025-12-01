import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { fetchSiteData } from "../lib/api"
import { DashboardView } from "../components/dashboard-view"
import { InvoiceList } from "../components/invoice-list"
import { WPMonitorResponse, UpdateLog } from "@/types/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

function processLogsToChart(logs: UpdateLog[]) {
  const chartData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    
    const dateKey = d.toISOString().split('T')[0]; 
    const displayDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const count = logs.filter(log => log.data.startsWith(dateKey)).length;

    chartData.push({
      name: displayDate,
      atual: count,
      anterior: 0 
    });
  }
  return chartData;
}

interface DashboardData extends WPMonitorResponse {
  status: "online" | "offline";
  lastCheck: string;
  analytics?: { name: string; atual: number; anterior: number }[];
}

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
  
  const cookieStore = await cookies()
  const isAdmin = cookieStore.has('admin_session')

  const clientUser = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { 
        sites: true,
        invoices: {
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        }
    }
  })
  
  if (!clientUser) notFound()

  const siteConfig = clientUser.sites.find(s => s.id === siteId)
  if (!siteConfig) notFound()

  const apiData = await fetchSiteData(clientSlug, siteId)
  
  let finalData: DashboardData;

  if (!apiData) {
    finalData = {
      ...MOCK_DATA,
      status: "offline",
      lastCheck: new Date().toLocaleTimeString(),
      sistema: { ...MOCK_DATA.sistema, nome_site: siteConfig.name, url: siteConfig.url }
    }
  } else {
    const realChartData = processLogsToChart(apiData.logs_recentes || []);
    
    finalData = {
      ...apiData,
      status: "online",
      lastCheck: new Date().toLocaleTimeString(),
      analytics: realChartData
    }
  }

  return (
    <div>
        {clientUser.sites.length > 1 && (
            <div className="p-4 md:p-8 pb-0 print:hidden">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                    <Link href={`/dashboard/${clientSlug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para lista de sites
                    </Link>
                </Button>
            </div>
        )}
        
        <div className="px-4 md:px-8 pt-6 -mb-6 print:hidden">
            <InvoiceList invoices={clientUser.invoices} />
        </div>

        <DashboardView 
            clientSlug={clientSlug} 
            clientName={siteConfig.name} 
            data={finalData} 
            siteCredentials={{
                url: siteConfig.url,
                token: siteConfig.apiToken
            }}
            invoices={clientUser.invoices}
            isAdmin={isAdmin}
        />
    </div>
  )
}