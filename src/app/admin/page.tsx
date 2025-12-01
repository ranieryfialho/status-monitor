import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import { deleteSiteAction } from "@/app/actions/client";
import { AddClientDialog } from "@/components/add-client-dialog";
import { ClientActions } from "./components/client-actions";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { MiniUptimeMonitor } from "@/components/mini-uptime-monitor";
import { GlobalStatusCard } from "@/components/global-status-card";
import { EditSiteDialog } from "@/components/edit-site-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  CheckCircle2,
  LayoutDashboard,
  Server,
  LogOut,
  Trash2,
  Globe,
} from "lucide-react";

export default async function AdminDashboard() {
  const adminId = (await cookies()).get("admin_session")?.value;

  if (!adminId) {
    redirect("/login");
  }

  const clients = await prisma.client.findMany({
    where: { adminId: adminId },
    include: {
      sites: true,
      invoices: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const allSites = clients.flatMap((client) =>
    client.sites.map((site) => ({ url: site.url, apiToken: site.apiToken }))
  );

  const totalSitesCount = allSites.length;

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
          <ChangePasswordDialog type="admin" />
          <form action={logoutAction}>
            <Button
              variant="outline"
              className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
            >
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
            <div className="text-2xl font-bold text-foreground">
              {totalSitesCount} Sites
            </div>
            <p className="text-xs text-muted-foreground">
              distribuídos em {clients.length} clientes
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-card rounded-[20px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Base de Clientes
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {clients.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Gestores ativos na plataforma
            </p>
          </CardContent>
        </Card>

        <GlobalStatusCard sites={allSites} />
      </div>

      <Card className="border-none shadow-lg bg-card rounded-[20px] overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-bold text-foreground">
            Monitoramento em Tempo Real
          </h3>
        </div>

        {clients.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Nenhum cliente cadastrado.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-6 text-muted-foreground w-[200px]">
                  Gestor / Cliente
                </TableHead>
                <TableHead className="text-muted-foreground w-[350px]">
                  Sites Vinculados
                </TableHead>
                <TableHead className="text-muted-foreground text-center">
                  Monitoramento (Uptime)
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Status Geral
                </TableHead>
                <TableHead className="text-muted-foreground text-right pr-6">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="pl-6 font-medium align-top py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground font-semibold">
                        {client.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {client.slug}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4" colSpan={2}>
                    <div className="flex flex-col gap-3">
                      {client.sites.map((site) => (
                        <div
                          key={site.id}
                          className="flex items-center w-full group border-b last:border-0 border-border/40 pb-2 last:pb-0"
                        >
                          <div className="flex items-center justify-between w-[350px] shrink-0 pr-4 gap-2">
                            <span
                              className="text-sm font-medium text-foreground"
                              title={site.name}
                            >
                              {site.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-primary"
                                asChild
                                title="Visitar Site"
                              >
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Globe className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-blue-500"
                                asChild
                                title="Acessar WP Admin"
                              >
                                <a
                                  href={`${site.url.replace(
                                    /\/$/,
                                    ""
                                  )}/wp-admin`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <LayoutDashboard className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                              
                              <EditSiteDialog site={site} />

                              <form action={deleteSiteAction}>
                                <input
                                  type="hidden"
                                  name="siteId"
                                  value={site.id}
                                />
                                <button
                                  type="submit"
                                  className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 cursor-pointer"
                                  title="Remover este site"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </form>
                            </div>
                          </div>

                          <div className="flex-1 flex justify-center px-4">
                            <MiniUptimeMonitor
                              url={site.url}
                              token={site.apiToken}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="align-top py-4">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0"
                    >
                      <Activity className="mr-1 h-3 w-3" />{" "}
                      {client.sites.length} Ativos
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-6 align-top py-4">
                    <ClientActions
                      clientSlug={client.slug}
                      clientId={client.id}
                      clientName={client.name}
                      accessCode={client.accessCode}
                      invoices={client.invoices}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}