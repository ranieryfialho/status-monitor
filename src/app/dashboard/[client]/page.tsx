import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, ArrowRight, LogOut, Server } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { MiniUptimeMonitor } from "@/components/mini-uptime-monitor"
import { GlobalStatusCard } from "@/components/global-status-card" // <--- 1. IMPORT NOVO

export default async function ClientSitesPage({
  params,
}: {
  params: Promise<{ client: string }>
}) {
  const { client: clientSlug } = await params
  
  const clientUser = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { sites: true }
  })
  
  if (!clientUser) {
    notFound()
  }

  // Se tiver apenas 1 site, redireciona direto (mantendo a lógica original)
  if (clientUser.sites.length === 1) {
     redirect(`/dashboard/${clientSlug}/${clientUser.sites[0].id}`)
  }

  // --- 2. PREPARAR DADOS PARA O MONITOR GLOBAL DO CLIENTE ---
  const clientSitesForMonitor = clientUser.sites.map(s => ({
    url: s.url,
    apiToken: s.apiToken
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Painel do Gestor
          </h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bem-vindo, {clientUser.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral da sua carteira de sites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ChangePasswordDialog type="client" identifier={clientSlug} />

          <form action={logoutAction}>
            <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>

      {/* --- 3. NOVA SEÇÃO DE RESUMO (IGUAL AO ADMIN) --- */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        
        {/* Card de Total de Sites do Cliente */}
        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Seus Sites
            </CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clientUser.sites.length}</div>
            <p className="text-xs text-muted-foreground">
              Sites vinculados à sua conta
            </p>
          </CardContent>
        </Card>

        {/* O MONITOR GLOBAL (Filtrado apenas para este cliente) */}
        <GlobalStatusCard sites={clientSitesForMonitor} />

      </div>

      <h3 className="text-lg font-bold text-foreground mb-4">Sites Individuais</h3>

      {/* Grid de Cards Individuais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientUser.sites.map((site) => (
          <Link key={site.id} href={`/dashboard/${clientSlug}/${site.id}`} className="group">
            <Card className="h-full border-none shadow-lg bg-card rounded-[20px] transition-all hover:shadow-xl hover:scale-[1.02] hover:bg-card/90 cursor-pointer border border-transparent hover:border-primary/20 flex flex-col">
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start h-10">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>

                  <div className="w-[120px] h-full flex items-center justify-end">
                    <MiniUptimeMonitor url={site.url} token={site.apiToken} />
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-4">
                  {site.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="mt-auto">
                <p className="text-sm text-muted-foreground truncate mb-4">
                  {site.url}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Ver Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}