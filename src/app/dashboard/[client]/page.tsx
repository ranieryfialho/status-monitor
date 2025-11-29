import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, ArrowRight, LogOut, Server, LayoutDashboard } from "lucide-react" // <--- Adicionado LayoutDashboard
import { logoutAction } from "@/app/actions/auth"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { MiniUptimeMonitor } from "@/components/mini-uptime-monitor" 
import { GlobalStatusCard } from "@/components/global-status-card"

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

  if (clientUser.sites.length === 1) {
     redirect(`/dashboard/${clientSlug}/${clientUser.sites[0].id}`)
  }

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

      <div className="grid gap-6 md:grid-cols-2 mb-8">
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

        <GlobalStatusCard sites={clientSitesForMonitor} />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-4">Sites Individuais</h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientUser.sites.map((site) => (
          // Removemos o Link wrapper geral para evitar conflito de clique nos botões
          <Card key={site.id} className="h-full border-none shadow-lg bg-card rounded-[20px] transition-all hover:shadow-xl border border-transparent hover:border-primary/20 flex flex-col">
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start h-8 mb-2">
                  {/* Ícone Decorativo */}
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>

                  {/* Monitor Uptime */}
                  <div className="w-[120px] h-full flex items-center justify-end">
                    <MiniUptimeMonitor url={site.url} token={site.apiToken} />
                  </div>
                </div>
                
                <CardTitle className="text-lg font-bold text-foreground truncate" title={site.name}>
                  {site.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground truncate">
                  {site.url}
                </p>
              </CardHeader>

              <CardContent className="mt-auto pt-4">
                <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-2">
                  
                  {/* Link Principal: Ver Dashboard Interno */}
                  <Link 
                    href={`/dashboard/${clientSlug}/${site.id}`} 
                    className="flex items-center text-sm font-medium text-primary hover:underline group"
                  >
                    Ver Dashboard <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {/* Botões de Ação Rápida (Estilo Admin) */}
                  <div className="flex items-center gap-1">
                    
                    {/* Botão Site */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" asChild title="Visitar Site">
                      <a href={site.url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                      </a>
                    </Button>

                    {/* Botão Admin */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10" asChild title="Acessar WP Admin">
                      <a href={`${site.url.replace(/\/$/, "")}/wp-admin`} target="_blank" rel="noopener noreferrer">
                        <LayoutDashboard className="h-4 w-4" />
                      </a>
                    </Button>

                  </div>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}