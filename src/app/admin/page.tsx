import Link from "next/link"
import { CLIENTS } from "@/lib/clients"
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
  Plus, 
  Server 
} from "lucide-react"

export default function AdminDashboard() {
  // Simulação de status (no futuro isso virá de uma verificação em tempo real)
  const totalSites = CLIENTS.length
  const sitesOnline = totalSites // Por enquanto todos online
  const sitesOffline = 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      {/* CABEÇALHO ADMIN */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Visão Geral da Agência
          </h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Painel do Administrador
          </h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* CARDS DE RESUMO (KPIs) */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Monitorado
            </CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSites} Sites</div>
            <p className="text-xs text-muted-foreground">
              +1 adicionado este mês
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

      {/* LISTA DE CLIENTES */}
      <Card className="border-none shadow-lg bg-card rounded-[20px] overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-bold text-foreground">Monitoramento em Tempo Real</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="pl-6 text-muted-foreground">Cliente / Site</TableHead>
              <TableHead className="text-muted-foreground">URL</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
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
                  <a 
                    href={client.apiUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {client.apiUrl.replace('https://', '')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">
                    <Activity className="mr-1 h-3 w-3" /> Online
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                    <Link href={`/dashboard/${client.slug}`}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Ver Painel
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