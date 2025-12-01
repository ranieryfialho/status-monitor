"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import { logoutAction } from "@/app/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpdatesTable } from "./updates-table";
import { UptimeMonitor } from "./uptime-monitor";
import { InstalledPlugins } from "./installed-plugins";
// REMOVIDO O IMPORT QUE CAUSAVA ERRO (InstalledPlugin) pois não é usado diretamente aqui como tipo
import { WPMonitorResponse } from "@/types/api";
import {
  Download,
  LogOut,
  Database,
  Globe,
  CheckCircle2,
  XCircle,
  HardDrive,
} from "lucide-react";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { ReportPdf } from "@/components/report-pdf";

// Interface local para evitar conflitos se o types/api.ts estiver desatualizado
interface DashboardData extends WPMonitorResponse {
  status: "online" | "offline";
  lastCheck: string;
  analytics?: {
    name: string;
    atual: number;
    anterior: number;
  }[];
}

interface Invoice {
  id: string;
  description: string;
  amount: number;
  paymentUrl: string | null;
  status: string;
  createdAt: Date;
}

interface DashboardViewProps {
  clientSlug: string;
  clientName: string;
  data: DashboardData;
  siteCredentials: {
    url: string;
    token: string;
  };
  invoices?: Invoice[];
}

const printPageStyle = `
  @page {
    size: A4 portrait;
    margin: 0 !important;
  }
  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100%;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background-color: #0B1437 !important;
    }
  }
`;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export function DashboardView({
  clientSlug,
  clientName,
  data,
  siteCredentials,
  invoices = [],
}: DashboardViewProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const isInitialOffline = data.status === "offline";

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio-${clientName.replace(/\s+/g, "-")}`,
    pageStyle: printPageStyle,
  });

  const reportDataFormatted = [
    {
      ...data,
      id: "current-site",
      name: clientName,
      status: data.status,
      lastCheck: data.lastCheck,
    },
  ];

  const pendingInvoices = invoices.filter((inv) => inv.status === "PENDING");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            Painel de Controle / Visão Geral
          </h2>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Olá, {clientName}
            </h1>
            <span className="text-2xl animate-pulse">👋</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <p>Aqui está o status atual do seu ambiente WordPress.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChangePasswordDialog type="client" identifier={clientSlug} />
          <form action={logoutAction}>
            <Button
              variant="outline"
              className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </form>
          <Button
            onClick={() => handlePrint()}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>

      {/* DASHBOARD TELA */}
      <div className="print:hidden">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={item}>
              <Card
                className={`h-full border-none shadow-lg bg-card rounded-[20px] transition-colors duration-300 ${
                  isInitialOffline
                    ? "bg-red-950/30 border border-red-900/50"
                    : "bg-card"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ambiente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isInitialOffline ? "bg-red-500" : "bg-green-400"
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          isInitialOffline ? "bg-red-500" : "bg-green-500"
                        }`}
                      ></span>
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        isInitialOffline ? "text-red-500" : "text-foreground"
                      }`}
                    >
                      {isInitialOffline ? "Offline" : "Online"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs text-muted-foreground">
                      WP:{" "}
                      <span className="text-primary font-semibold">
                        {data.sistema?.wp_version}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Tema:{" "}
                      <span className="text-foreground font-semibold">
                        {data.sistema?.tema?.nome}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg bg-card rounded-[20px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Infraestrutura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold text-foreground mt-2 truncate">
                    PHP {data.sistema?.php}
                  </h3>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs text-muted-foreground">
                      IP:{" "}
                      <span className="text-foreground font-mono">
                        {data.sistema?.ip || "-"}
                      </span>
                    </span>
                    <a
                      href={data.sistema?.url}
                      target="_blank"
                      className="text-xs text-primary hover:underline mt-1 truncate"
                    >
                      {data.sistema?.url}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ----- CARD DE BACKUP (CORREÇÃO DO ESPAÇAMENTO AQUI) ----- */}
            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg bg-card rounded-[20px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Database className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Sistema de Backup
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  {data.backup?.historico &&
                  data.backup.historico.length > 0 ? (
                    <div className="flex flex-col gap-2 flex-1 mt-2">
                      {data.backup.historico.slice(0, 1).map((bkp, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex flex-col gap-0.5">
                            {/* CORREÇÃO: Adicionado 'gap-2' nesta linha abaixo */}
                            <span className="text-xs font-bold text-foreground flex items-center gap-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  i === 0
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-muted-foreground/50"
                                }`}
                              ></div>
                              {new Date(bkp.data).toLocaleDateString("pt-BR")}
                            </span>
                            <span className="text-[10px] text-muted-foreground pl-3">
                              {new Date(bkp.data).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              • {bkp.tipo}
                            </span>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded flex items-center gap-1 border text-muted-foreground bg-muted/50 border-transparent">
                              <HardDrive className="h-3 w-3 opacity-50" />
                              {bkp.tamanho === "N/A" ? "Não inf." : bkp.tamanho}
                            </span>
                            {bkp.link && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-primary hover:bg-primary/10 hover:text-primary"
                                asChild
                              >
                                <a
                                  href={bkp.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            data.backup?.ativo ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <h3 className="text-2xl font-bold text-foreground">
                          {data.backup?.ativo ? "Ativo" : "Inativo"}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Monitoramento via Plugin
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
            <motion.div variants={item} className="xl:col-span-1">
              <InstalledPlugins plugins={data.plugins_instalados || []} />
            </motion.div>
            <motion.div variants={item} className="xl:col-span-1">
              <UpdatesTable logs={data.logs_recentes || []} />
            </motion.div>
            <motion.div variants={item} className="xl:col-span-1 min-h-[300px]">
              <UptimeMonitor
                initialStatus={data.status}
                siteUrl={siteCredentials.url}
                apiToken={siteCredentials.token}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ÁREA DE IMPRESSÃO */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div ref={componentRef}>
          <ReportPdf
            clientName={clientName}
            sitesData={reportDataFormatted}
            invoices={pendingInvoices}
          />
        </div>
      </div>
    </div>
  );
}