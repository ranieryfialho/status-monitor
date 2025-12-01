"use client"

import { Activity, ShieldCheck, CheckCircle2, XCircle, LayoutTemplate, Server } from "lucide-react"
import { WPMonitorResponse } from "@/types/api"

interface SiteReportData extends WPMonitorResponse {
  id: string;
  name: string;
  status: "online" | "offline";
  lastCheck: string;
}

interface ReportPdfProps {
  clientName: string;
  sitesData: SiteReportData[];
}

export function ReportPdf({ clientName, sitesData }: ReportPdfProps) {
  
  const theme = {
    bg: 'bg-[#0B1437]',
    textMain: 'text-white',
    textMuted: 'text-gray-400',
    border: 'border-white/10',
    cardBg: 'bg-white/5',
    divide: 'divide-white/5',
    headerBorder: 'border-white/20',
  }

  return (
    <div className={`print-container font-sans`}>
      
      {sitesData.map((data, index) => {
        const isOnline = data.status === "online"
        
        return (
          <div 
            key={data.id} 
            className={`${theme.bg} ${theme.textMain} w-full min-h-[297mm] p-8 relative flex flex-col ${index < sitesData.length - 1 ? 'page-break' : ''}`}
          >
            
            <div className={`flex justify-between items-start border-b ${theme.headerBorder} pb-4 mb-6`}>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-1">
                  Relatório Técnico • {clientName}
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{data.name}</h1>
                <div className={`text-xs ${theme.textMuted} mt-1`}>{data.sistema?.url}</div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted} block mb-1`}>Data de Emissão</span>
                <span className="text-xl font-bold text-white">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className={`border ${theme.border} ${theme.cardBg} rounded-lg p-3 flex flex-col justify-center`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>Disponibilidade</span>
                  <Activity className={`h-3 w-3 ${theme.textMuted}`} />
                </div>
                <div className="text-lg font-bold flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-500'}`}></div>
                  {isOnline ? 'Operacional' : 'Indisponível'}
                </div>
              </div>

              <div className={`border ${theme.border} ${theme.cardBg} rounded-lg p-3 flex flex-col justify-center`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>Segurança</span>
                  <ShieldCheck className={`h-3 w-3 ${theme.textMuted}`} />
                </div>
                <div className="text-lg font-bold flex items-center gap-2">
                  {data.backup?.ativo ? (
                      <><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Ativo</>
                    ) : (
                      <><XCircle className="h-3 w-3 text-red-400" /> Inativo</>
                    )}
                </div>
              </div>

              <div className={`border ${theme.border} ${theme.cardBg} rounded-lg p-3 flex flex-col justify-center`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>WordPress</span>
                  <LayoutTemplate className={`h-3 w-3 ${theme.textMuted}`} />
                </div>
                <div className="text-lg font-bold">{data.sistema?.wp_version || '-'}</div>
              </div>

              <div className={`border ${theme.border} ${theme.cardBg} rounded-lg p-3 flex flex-col justify-center`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] font-bold ${theme.textMuted} uppercase tracking-wider`}>Servidor</span>
                  <Server className={`h-3 w-3 ${theme.textMuted}`} />
                </div>
                <div className="text-lg font-bold">PHP {data.sistema?.php || '-'}</div>
              </div>
            </div>

            <div className="flex-1">
              
              <div className="mb-6 break-inside-avoid">
                <h3 className="text-xs font-bold text-white border-l-4 border-emerald-500 pl-3 mb-3 uppercase tracking-wider">
                  Registro de Manutenção
                </h3>
                <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
                  <table className="w-full text-xs text-left">
                    <thead className={theme.cardBg}>
                      <tr>
                        <th className={`py-2 px-3 font-bold ${theme.textMuted} w-1/3`}>Item</th>
                        <th className={`py-2 px-3 font-bold ${theme.textMuted}`}>Versão</th>
                        <th className={`py-2 px-3 font-bold ${theme.textMuted}`}>Data</th>
                        <th className={`py-2 px-3 font-bold ${theme.textMuted} text-right`}>Resultado</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme.divide}`}>
                      {data.logs_recentes && data.logs_recentes.length > 0 ? (
                        data.logs_recentes.slice(0, 8).map((log, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-medium text-white">{log.plugin}</td>
                            <td className={`py-2 px-3 ${theme.textMuted} font-mono text-[10px]`}>{log.versao}</td>
                            <td className={`py-2 px-3 ${theme.textMuted}`}>{new Date(log.data).toLocaleDateString('pt-BR')}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400">Sucesso</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className={`py-4 text-center ${theme.textMuted} italic`}>
                            Nenhuma atualização recente registrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {data.backup?.historico && data.backup.historico.length > 0 && (
                <div className="mb-6 break-inside-avoid">
                  <h3 className="text-xs font-bold text-white border-l-4 border-blue-500 pl-3 mb-3 uppercase tracking-wider">
                    Backups Realizados
                  </h3>
                  <div className={`border ${theme.border} rounded-lg overflow-hidden`}>
                    <table className="w-full text-xs text-left">
                      <thead className={theme.cardBg}>
                        <tr>
                          <th className={`py-2 px-3 font-bold ${theme.textMuted}`}>Data</th>
                          <th className={`py-2 px-3 font-bold ${theme.textMuted}`}>Sistema</th>
                          <th className={`py-2 px-3 font-bold ${theme.textMuted} text-right`}>Tamanho</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme.divide}`}>
                        {data.backup.historico.slice(0, 5).map((bkp, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-medium text-white">
                              {new Date(bkp.data).toLocaleDateString('pt-BR')} 
                              <span className={`text-[10px] ml-2 ${theme.textMuted}`}>{new Date(bkp.data).toLocaleTimeString('pt-BR')}</span>
                            </td>
                            <td className={`py-2 px-3 ${theme.textMuted}`}>{bkp.tipo}</td>
                            <td className={`py-2 px-3 text-right font-mono ${theme.textMuted}`}>{bkp.tamanho}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="break-inside-avoid">
                <h3 className="text-xs font-bold text-white border-l-4 border-orange-500 pl-3 mb-3 uppercase tracking-wider">
                  Plugins Instalados
                </h3>
                <div className={`grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] border-t ${theme.border} pt-3`}>
                    {data.plugins_instalados?.map((plugin, i) => (
                      <div key={i} className={`flex justify-between border-b ${theme.divide} pb-1`}>
                        <span className="font-medium text-gray-200 truncate pr-2">{plugin.nome}</span>
                        <span className={`font-mono whitespace-nowrap ${theme.textMuted}`}>v{plugin.versao}</span>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            <div className={`mt-8 pt-4 border-t ${theme.border} text-center`}>
              <p className={`text-[9px] ${theme.textMuted} uppercase tracking-[0.2em]`}>
                Relatório Gerado Automaticamente • Status Monitor • Página {index + 1}/{sitesData.length}
              </p>
            </div>

          </div>
        )
      })}

      <style jsx global>{`
        @media print {
          .page-break {
            break-after: always;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  )
}