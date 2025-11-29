"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { motion } from "framer-motion"
import { logoutAction } from "@/app/actions/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpdatesTable } from "./updates-table"
import { UptimeMonitor } from "./uptime-monitor"
import { InstalledPlugins } from "./installed-plugins"
import { WPMonitorResponse } from "@/types/api"
import { Download, LogOut, Database, HardDrive } from "lucide-react"

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
  clientName: string;
  data: DashboardData;
  siteCredentials: {
    url: string;
    token: string;
  }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function DashboardView({ clientName, data, siteCredentials }: DashboardViewProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  
  const isInitialOffline = data.status === "offline"

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio-${clientName}-${new Date().toISOString().split('T')[0]}`,
  })

  return (
    <div 
      suppressHydrationWarning={true}
      className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300"
    >
      
      {/* CABEÇALHO (Tela) */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 no-print">
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
          <form action={logoutAction}>
            <Button 
              variant="outline" 
              className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
              title="Sair do sistema"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>

          <Button 
            onClick={() => handlePrint()}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      {/* ÁREA IMPRESSA */}
      <div ref={componentRef} className="print-container">
        
        <div className="print:p-6">
          
          {/* Cabeçalho PDF */}
          <div className="hidden print:flex flex-col mb-8 border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-white mb-1">Relatório Mensal</h1>
            <h2 className="text-xl text-gray-300">{clientName}</h2>
            <p className="text-sm text-gray-400 mt-2">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* GRID PRINCIPAL */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* CARD 1: AMBIENTE */}
              <motion.div variants={item} className="break-inside-avoid">
                <Card className={`print-card p-6 border-none shadow-lg bg-card rounded-[20px] transition-colors duration-300 ${isInitialOffline ? 'bg-red-950/30 border border-red-900/50' : 'bg-card'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Ambiente</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`relative flex h-3 w-3 print:hidden`}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isInitialOffline ? 'bg-red-500' : 'bg-green-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isInitialOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      </span>
                      <span className={`hidden print:inline-block h-3 w-3 rounded-full ${isInitialOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      
                      <span className={`text-2xl font-bold ${isInitialOffline ? 'text-red-500' : 'text-foreground print-text-white'}`}>
                        {isInitialOffline ? 'Offline' : 'Online'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-xs text-muted-foreground print-text-muted">
                          WP: <span className="text-primary font-semibold print-text-primary">{data.sistema?.wp_version}</span>
                        </span>
                        <span className="text-xs text-muted-foreground print-text-muted">
                          Tema: <span className="text-foreground font-semibold">{data.sistema?.tema?.nome || "Padrão"} <span className="opacity-50">v{data.sistema?.tema?.versao}</span></span>
                        </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* CARD 2: INFRAESTRUTURA */}
              <motion.div variants={item} className="break-inside-avoid">
                <Card className="print-card p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Infraestrutura</span>
                    <h3 className="text-2xl font-bold text-foreground mt-2 truncate print-text-white">
                      PHP {data.sistema?.php}
                    </h3>
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-xs text-muted-foreground print-text-muted">
                            IP: <span className="text-foreground font-mono print-text-white">{data.sistema?.ip || "-"}</span>
                        </span>
                        <a href={data.sistema?.url} className="text-xs text-primary hover:underline mt-1 truncate print-text-primary">
                        {data.sistema?.url}
                        </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              {/* CARD 3: BACKUP (Com Botão e Tratamento N/A) */}
              <motion.div variants={item} className="break-inside-avoid">
                <Card className="print-card p-6 border-none shadow-lg bg-card rounded-[20px] h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Database className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Sistema de Backup</span>
                  </div>

                  {data.backup?.historico && data.backup.historico.length > 0 ? (
                    <div className="flex flex-col gap-2 flex-1">
                      {data.backup.historico.map((bkp, i) => (
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
                              {/* Badge de Tamanho (Com tratamento N/A) */}
                              <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded flex items-center gap-1 border ${
                                  bkp.tamanho === 'N/A' 
                                    ? 'text-muted-foreground bg-muted/50 border-transparent' 
                                    : 'text-foreground bg-background border-border'
                              }`}>
                                  <HardDrive className="h-3 w-3 opacity-50" />
                                  {bkp.tamanho === 'N/A' ? 'Não inf.' : bkp.tamanho}
                              </span>

                              {/* Botão de Download */}
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
                    <div className="flex flex-col gap-2 mt-2 h-full justify-center">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${data.backup?.ativo ? 'bg-green-500' : 'bg-red-500'} print:bg-green-500`} />
                        <h3 className="text-2xl font-bold text-foreground print-text-white">
                          {data.backup?.ativo ? "Ativo" : "Inativo"}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground print-text-muted">
                        Monitoramento via Plugin
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>

            </div>

            {/* GRID SECUNDÁRIO */}
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
              <motion.div variants={item} className="xl:col-span-1 break-inside-avoid">
                <div className="print-card rounded-[20px] overflow-hidden p-1 h-full">
                  <InstalledPlugins plugins={data.plugins_instalados || []} />
                </div>
              </motion.div>

              <motion.div variants={item} className="xl:col-span-1 break-inside-avoid">
                <div className="print-card rounded-[20px] overflow-hidden p-1 h-full">
                  <UpdatesTable logs={data.logs_recentes || []} />
                </div>
              </motion.div>

              <motion.div variants={item} className="xl:col-span-1 min-h-[300px] break-inside-avoid print-chart-container">
                <div className="print-card h-full w-full rounded-[20px] p-1">
                  <UptimeMonitor 
                    initialStatus={data.status} 
                    siteUrl={siteCredentials.url}
                    apiToken={siteCredentials.token}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 15mm; size: auto; }
          .no-print { display: none !important; }
          :root {
            --background: 222 47% 11% !important; 
            --foreground: 210 40% 98% !important; 
            --card: 217 33% 17% !important; 
            --card-foreground: 210 40% 98% !important;
            --muted-foreground: 215 20.2% 65.1% !important;
            --border: 217 33% 25% !important;
            --primary: 245 100% 65% !important;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background-color: hsl(222 47% 11%) !important; color: hsl(210 40% 98%) !important; }
          .print-chart-container { display: block !important; height: 350px !important; page-break-inside: avoid !important; }
          .break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; margin-bottom: 24px; }
          .print-card, .card { background-color: #111C44 !important; border: 1px solid #2B3674 !important; color: white !important; box-shadow: none !important; }
          h1, h2, h3, h4, p, div, span, strong { color: white !important; }
          .print-text-muted, .text-muted-foreground { color: #A3AED0 !important; }
          .print-text-primary, .text-primary, a { color: #7551FF !important; }
          table, thead, tbody, tr, td, th { background-color: #111C44 !important; color: white !important; border-color: #2B3674 !important; }
          tr:nth-child(even), tr:nth-child(odd) { background-color: #111C44 !important; }
          .badge { background-color: #0B1437 !important; color: white !important; border: 1px solid #2B3674; }
          .shadow-lg { box-shadow: none !important; border: 1px solid hsl(217 33% 25%) !important; }
        }
      `}</style>
    </div>
  )
}