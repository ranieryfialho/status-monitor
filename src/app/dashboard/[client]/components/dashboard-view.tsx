"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { motion } from "framer-motion"
import { logoutAction } from "@/app/actions/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpdatesTable } from "./updates-table"
import { TrafficChart } from "./traffic-chart"
import { WPMonitorResponse } from "@/types/api"
import { Download, LogOut } from "lucide-react"

interface DashboardData extends WPMonitorResponse {
  analytics: {
    name: string;
    atual: number;
    anterior: number;
  }[];
}

interface DashboardViewProps {
  clientName: string;
  data: DashboardData;
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

export function DashboardView({ clientName, data }: DashboardViewProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Relatorio-${clientName}-${new Date().toISOString().split('T')[0]}`,
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      {/* CABEÇALHO (Visível apenas na tela) */}
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
          <p className="text-muted-foreground">
            Aqui está o status atual do seu ambiente WordPress.
          </p>
        </div>

        {/* Grupo de Botões (Logout + Download) */}
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
        
        {/* Padding interno */}
        <div className="print:p-6">
          
          {/* Cabeçalho do PDF */}
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
              
              <motion.div variants={item} className="break-inside-avoid">
                <Card className="print-card p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Status do Site</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="hidden print:inline-block h-3 w-3 rounded-full bg-green-500 border border-green-400"></span>
                      <span className="relative flex h-3 w-3 print:hidden">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-2xl font-bold text-foreground print-text-white">Online</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 print-text-muted">
                      Versão WP: <span className="text-primary font-semibold print-text-primary">{data.sistema?.wp_version}</span>
                    </span>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item} className="break-inside-avoid">
                <Card className="print-card p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Endereço IP</span>
                    <h3 className="text-2xl font-bold text-foreground mt-2 truncate print-text-white">
                      {data.sistema?.ip || "127.0.0.1"}
                    </h3>
                    <a href={data.sistema?.url} className="text-xs text-primary hover:underline mt-2 truncate print-text-primary">
                      {data.sistema?.url}
                    </a>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div variants={item} className="break-inside-avoid">
                <Card className="print-card p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground print-text-muted">Sistema de Backup</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`h-2 w-2 rounded-full ${data.backup?.ativo ? 'bg-green-500' : 'bg-red-500'} print:bg-green-500`} />
                      <h3 className="text-2xl font-bold text-foreground print-text-white">
                        {data.backup?.ativo ? "Ativo" : "Inativo"}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 print-text-muted">
                      Monitoramento via Plugin
                    </span>
                  </div>
                </Card>
              </motion.div>

            </div>

            {/* GRID SECUNDÁRIO */}
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
              
              <motion.div variants={item} className="xl:col-span-2 break-inside-avoid">
                <div className="print-card rounded-[20px] overflow-hidden p-1">
                  <UpdatesTable logs={data.logs_recentes || []} />
                </div>
              </motion.div>

              <motion.div variants={item} className="xl:col-span-1 min-h-[300px] break-inside-avoid print-chart-container">
                <div className="print-card h-full rounded-[20px] p-1">
                  <TrafficChart data={data.analytics} />
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}