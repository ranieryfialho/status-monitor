"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpdatesTable } from "./updates-table"
import { TrafficChart } from "./traffic-chart"
import { WPMonitorResponse } from "@/types/api"
import { Download } from "lucide-react"

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

        <Button 
          onClick={() => handlePrint()}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Relatório PDF
        </Button>
      </div>

      {/* ÁREA IMPRESSA */}
      <div ref={componentRef} className="print-container">
        
        {/* Padding interno removido na div, pois a margem será controlada pelo @page */}
        <div>
          
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
                <Card className="p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Status do Site</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="hidden print:inline-block h-3 w-3 rounded-full bg-green-500 border border-green-400"></span>
                      <span className="relative flex h-3 w-3 print:hidden">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      <span className="text-2xl font-bold text-foreground">Online</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      Versão WP: <span className="text-primary font-semibold">{data.sistema?.wp_version}</span>
                    </span>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item} className="break-inside-avoid">
                <Card className="p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Endereço IP</span>
                    <h3 className="text-2xl font-bold text-foreground mt-2 truncate">
                      {data.sistema?.ip || "127.0.0.1"}
                    </h3>
                    <a href={data.sistema?.url} className="text-xs text-primary hover:underline mt-2 truncate">
                      {data.sistema?.url}
                    </a>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div variants={item} className="break-inside-avoid">
                <Card className="p-6 border-none shadow-lg bg-card rounded-[20px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Sistema de Backup</span>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`h-2 w-2 rounded-full ${data.backup?.ativo ? 'bg-green-500' : 'bg-red-500'} print:bg-green-500`} />
                      <h3 className="text-2xl font-bold text-foreground">
                        {data.backup?.ativo ? "Ativo" : "Inativo"}
                      </h3>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      Monitoramento via Plugin
                    </span>
                  </div>
                </Card>
              </motion.div>

            </div>

            {/* GRID SECUNDÁRIO */}
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-3">
              
              <motion.div variants={item} className="xl:col-span-2 break-inside-avoid">
                <UpdatesTable logs={data.logs_recentes || []} />
              </motion.div>

              <motion.div variants={item} className="xl:col-span-1 min-h-[300px] break-inside-avoid print-chart-container">
                <TrafficChart data={data.analytics} />
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          /* 1. MARGENS CORRETAS */
          @page { 
            margin: 15mm; /* Adiciona respiro nas bordas do papel */
            size: auto; 
          }
          
          .no-print { display: none !important; }
          
          /* 2. FORÇAR MODO ESCURO (NAVY) VIA VARIÁVEIS CSS */
          :root {
            /* Fundo Navy Profundo */
            --background: 222 47% 11% !important; 
            /* Texto Branco */
            --foreground: 210 40% 98% !important; 
            /* Cards Navy Mais Claro */
            --card: 217 33% 17% !important; 
            --card-foreground: 210 40% 98% !important;
            /* Texto Muted (Cinza Claro) */
            --muted-foreground: 215 20.2% 65.1% !important;
            /* Bordas */
            --border: 217 33% 25% !important;
            /* Cor Primária (Roxo) */
            --primary: 245 100% 65% !important;
          }

          /* Força o navegador a pintar os fundos */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Garante que o fundo da página seja Navy */
          body {
            background-color: hsl(222 47% 11%) !important;
            color: hsl(210 40% 98%) !important;
          }

          /* 3. AJUSTES ESPECÍFICOS PARA O GRÁFICO E LAYOUT */
          .print-chart-container {
            display: block !important;
            height: 350px !important;
            page-break-inside: avoid !important;
          }
          
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-bottom: 24px;
          }

          /* Remove sombras na impressão para visual mais flat/limpo */
          .shadow-lg {
            box-shadow: none !important;
            border: 1px solid hsl(217 33% 25%) !important;
          }
        }
      `}</style>
    </div>
  )
}