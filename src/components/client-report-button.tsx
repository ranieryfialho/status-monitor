"use client"

import { useState, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Download } from "lucide-react"
import { getClientReportDataAction, getSingleSiteReportDataAction } from "@/app/actions/report"
import { ReportPdf } from "@/components/report-pdf"

interface ClientReportButtonProps {
  clientSlug: string;
  clientName: string;
  siteId?: string;
  variant?: "header" | "icon";
}

const printPageStyle = `
  @page { size: A4 portrait; margin: 0 !important; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background-color: #0B1437 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
`;

export function ClientReportButton({ clientSlug, clientName, siteId, variant = "header" }: ClientReportButtonProps) {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<{ sites: any[], invoices: any[] } | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Relatorio-${clientName.replace(/\s+/g, '-')}-${siteId ? 'Site' : 'Geral'}`,
    pageStyle: printPageStyle,
  })

  const generateAndPrint = async () => {
    setLoading(true)
    try {
      let data;
      
      if (siteId) {
        data = await getSingleSiteReportDataAction(clientSlug, siteId)
      } else {
        data = await getClientReportDataAction(clientSlug)
      }

      if (data && data.sites.length > 0) {
        setReportData(data)
        setTimeout(() => {
          handlePrint()
          setLoading(false)
        }, 500)
      } else {
        alert("Não foi possível gerar o relatório.")
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao gerar o relatório.")
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {reportData && (
            <ReportPdf 
              clientName={clientName} 
              sitesData={reportData.sites} 
              invoices={reportData.invoices} 
            />
          )}
        </div>
      </div>

      {variant === "header" ? (
        <Button 
          onClick={generateAndPrint} 
          disabled={loading}
          variant="outline"
          className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-colors"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {loading ? "Gerando..." : "Baixar Relatório"}
        </Button>
      ) : (
        <Button 
          onClick={generateAndPrint} 
          disabled={loading}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10"
          title="Baixar Relatório deste site"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        </Button>
      )}
    </>
  )
}