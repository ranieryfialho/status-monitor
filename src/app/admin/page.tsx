import Link from "next/link"
import { CLIENTS } from "@/lib/clients"
import { logoutAction } from "@/app/actions/auth"
import { AddClientDialog } from "@/components/add-client-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  LayoutDashboard, 
  Server,
  LogOut 
} from "lucide-react"

export default function AdminDashboard() {
  const allSites = CLIENTS.flatMap(c => c.sites)
  const totalSitesCount = allSites.length
  
  const sitesOnline = totalSitesCount 
  const sitesOffline = 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Visão Geral da Agência
          </h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Painel do Administrador
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
           <form action={logoutAction}>
            <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>

          <AddClientDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Monitorado
            </CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSitesCount} Sites</div>
            <p className="text-xs text-muted-foreground">
              distribuídos em {CLIENTS.length} gestores/clientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sites Online
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{sitesOnline}</div>
            <p className="text-xs text-muted-foreground">
              100% de disponibilidade
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas Críticos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{sitesOffline}</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma ação necessária
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg bg-card rounded-[20px] overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-bold text-foreground">Monitoramento em Tempo Real</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="pl-6 text-muted-foreground">Gestor / Cliente</TableHead>
              <TableHead className="text-muted-foreground">Sites Vinculados</TableHead>
              <TableHead className="text-muted-foreground">Status Geral</TableHead>
              <TableHead className="text-muted-foreground text-right pr-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CLIENTS.map((client) => (
              <TableRow key={client.slug} className="border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="pl-6 font-medium">
                  <div className="flex flex-col">
                    <span className="text-foreground font-semibold">{client.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{client.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {client.sites.map((site) => (
                      <a 
                        key={site.id}
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {site.name}
                      </a>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">
                    <Activity className="mr-1 h-3 w-3" /> {client.sites.length} Ativos
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                    <Link href={`/dashboard/${client.slug}`}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Acessar Conta
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}