"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { motion } from "framer-motion"
import { logoutAction } from "@/app/actions/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpdatesTable } from "./updates-table"
import { UptimeMonitor } from "./uptime-monitor"
import { InstalledPlugins } from "./installed-plugins"
import { WPMonitorResponse } from "@/types/api"
import { Download, LogOut, Database, Globe, CheckCircle2, XCircle, Activity, ShieldCheck, LayoutTemplate, Server, HardDrive } from "lucide-react"
import { ChangePasswordDialog } from "@/components/change-password-dialog"

interface DashboardData extends WPMonitorResponse {
  status: "online" | "offline";
  lastCheck: string;
  analytics?: {
    name: string;
    atual: number;
    anterior: number;
  }[];
}

interface DashboardViewProps {
  clientSlug: string;
  clientName: string;
  data: DashboardData;
  siteCredentials: {
    url: string;
    token: string;
  }
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
    /* Evita quebra de página dentro de elementos importantes */
    .avoid-break {
      break-inside: avoid;
    }
  }
`;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function DashboardView({ clientSlug, clientName, data, siteCredentials }: DashboardViewProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  
  const isOnline = data.status === "online"
  const isInitialOffline = data.status === "offline"

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio-${clientName.replace(/\s+/g, '-')}`,
    pageStyle: printPageStyle,
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      {/* =====================================================================================
          1. HEADER DA TELA
         ===================================================================================== */}
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
            <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </form>
          <Button onClick={() => handlePrint()} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>

      {/* =====================================================================================
          2. DASHBOARD DE TELA
         ===================================================================================== */}
      <div className="print:hidden">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1: Ambiente */}
            <motion.div variants={item}>
              <Card className={`h-full border-none shadow-lg bg-card rounded-[20px] transition-colors duration-300 ${isInitialOffline ? 'bg-red-950/30 border border-red-900/50' : 'bg-card'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ambiente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isInitialOffline ? 'bg-red-500' : 'bg-green-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${isInitialOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    </span>
                    <span className={`text-2xl font-bold ${isInitialOffline ? 'text-red-500' : 'text-foreground'}`}>
                      {isInitialOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs text-muted-foreground">
                      WP: <span className="text-primary font-semibold">{data.sistema?.wp_version}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Tema: <span className="text-foreground font-semibold">{data.sistema?.tema?.nome || "Padrão"} <span className="opacity-50">v{data.sistema?.tema?.versao}</span></span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 2: Infraestrutura */}
            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg bg-card rounded-[20px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Infraestrutura</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-2xl font-bold text-foreground mt-2 truncate">
                    PHP {data.sistema?.php}
                  </h3>
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs text-muted-foreground">
                        IP: <span className="text-foreground font-mono">{data.sistema?.ip || "-"}</span>
                    </span>
                    <a href={data.sistema?.url} target="_blank" className="text-xs text-primary hover:underline mt-1 truncate">
                      {data.sistema?.url}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card 3: Backup */}
            <motion.div variants={item}>
              <Card className="h-full border-none shadow-lg bg-card rounded-[20px] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Database className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Sistema de Backup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  
                  {data.backup?.historico && data.backup.historico.length > 0 ? (
                    <div className="flex flex-col gap-2 flex-1 mt-2">
                      {data.backup.historico.slice(0, 1).map((bkp, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
                          <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                  <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`}></div>
                                  {new Date(bkp.data).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="text-[10px] text-muted-foreground pl-3">
                                  {new Date(bkp.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {bkp.tipo}
                              </span>
                          </div>
                          
                          <div className="text-right flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                                  bkp.tamanho === 'N/A' 
                                    ? 'text-muted-foreground bg-muted/50 border-transparent' 
                                    : 'text-foreground bg-background border-border'
                              }`}>
                                  <HardDrive className="h-3 w-3 opacity-50" />
                                  {bkp.tamanho === 'N/A' ? 'Não inf.' : bkp.tamanho}
                              </span>

                              {bkp.link && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-primary hover:bg-primary/10 hover:text-primary" 
                                  asChild
                                  title="Baixar Backup"
                                >
                                  <a href={bkp.link} target="_blank" rel="noopener noreferrer">
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
                        <div className={`h-2 w-2 rounded-full ${data.backup?.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
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
               <UptimeMonitor initialStatus={data.status} siteUrl={siteCredentials.url} apiToken={siteCredentials.token} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* =====================================================================================
          3. TEMPLATE DE IMPRESSÃO 
         ===================================================================================== */}
      <div style={{ display: "none" }}>
        <div ref={componentRef} className="print-container bg-[#0B1437] text-white w-full min-h-[297mm] p-8 font-sans">
          
          {/* HEADER PDF */}
          <div className="flex justify-between items-start border-b border-white/20 pb-4 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-1">Relatório Técnico</div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{clientName}</h1>
              <div className="text-xs text-gray-400 mt-1">{data.sistema?.url}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Data de Emissão</span>
              <span className="text-xl font-bold text-white">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* GRID DE KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Box 1 */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disponibilidade</span>
                <Activity className="h-3 w-3 text-gray-400" />
              </div>
              <div className="text-lg font-bold flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-500'}`}></div>
                {isOnline ? 'Operacional' : 'Indisponível'}
              </div>
            </div>

            {/* Box 2 */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Segurança</span>
                <ShieldCheck className="h-3 w-3 text-gray-400" />
              </div>
              <div className="text-lg font-bold flex items-center gap-2">
                {data.backup?.ativo ? (
                    <><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Ativo</>
                  ) : (
                    <><XCircle className="h-3 w-3 text-red-400" /> Inativo</>
                  )}
              </div>
            </div>

            {/* Box 3 */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">WordPress</span>
                <LayoutTemplate className="h-3 w-3 text-gray-400" />
              </div>
              <div className="text-lg font-bold">{data.sistema?.wp_version}</div>
            </div>

            {/* Box 4 */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-3 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Servidor</span>
                <Server className="h-3 w-3 text-gray-400" />
              </div>
              <div className="text-lg font-bold">PHP {data.sistema?.php}</div>
            </div>
          </div>

          {/* TABELA ATUALIZAÇÕES */}
          <div className="mb-6 avoid-break">
            <h3 className="text-xs font-bold text-white border-l-4 border-emerald-500 pl-3 mb-3 uppercase tracking-wider">
              Registro de Manutenção
            </h3>
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="py-2 px-3 font-bold text-gray-300 w-1/3">Item</th>
                    <th className="py-2 px-3 font-bold text-gray-300">Versão</th>
                    <th className="py-2 px-3 font-bold text-gray-300">Data</th>
                    <th className="py-2 px-3 font-bold text-gray-300 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.logs_recentes && data.logs_recentes.length > 0 ? (
                    data.logs_recentes.slice(0, 8).map((log, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium text-white">{log.plugin}</td>
                        <td className="py-2 px-3 text-gray-400 font-mono text-[10px]">{log.versao}</td>
                        <td className="py-2 px-3 text-gray-400">{new Date(log.data).toLocaleDateString('pt-BR')}</td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400">Sucesso</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500 italic">
                        Nenhuma atualização recente registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABELA BACKUPS  */}
          {data.backup?.historico && data.backup.historico.length > 0 && (
            <div className="mb-6 avoid-break">
              <h3 className="text-xs font-bold text-white border-l-4 border-blue-500 pl-3 mb-3 uppercase tracking-wider">
                Backups Realizados
              </h3>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="py-2 px-3 font-bold text-gray-300">Data</th>
                      <th className="py-2 px-3 font-bold text-gray-300">Sistema</th>
                      <th className="py-2 px-3 font-bold text-gray-300 text-right">Tamanho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.backup.historico.slice(0, 5).map((bkp, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 font-medium text-white">
                          {new Date(bkp.data).toLocaleDateString('pt-BR')} 
                          <span className="text-gray-500 text-[10px] ml-2">{new Date(bkp.data).toLocaleTimeString('pt-BR')}</span>
                        </td>
                        <td className="py-2 px-3 text-gray-400">{bkp.tipo}</td>
                        <td className="py-2 px-3 text-right font-mono text-gray-400">{bkp.tamanho}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LISTA DE PLUGINS  */}
          <div className="avoid-break">
             <h3 className="text-xs font-bold text-white border-l-4 border-orange-500 pl-3 mb-3 uppercase tracking-wider">
               Plugins Instalados
             </h3>
             <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] border-t border-white/10 pt-3">
                {data.plugins_instalados?.map((plugin, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-1">
                    <span className="font-medium text-gray-200 truncate pr-2">{plugin.nome}</span>
                    <span className="text-gray-500 font-mono whitespace-nowrap">v{plugin.versao}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* RODAPÉ PDF */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em]">
              Relatório Gerado Automaticamente • Status Monitor
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}