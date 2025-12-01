"use client"

import { useState, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddSiteDialog } from "@/components/add-site-dialog"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { ManageInvoicesDialog } from "@/components/manage-invoices-dialog"
import { deleteClientAction } from "@/app/actions/client"
import { getClientReportDataAction } from "@/app/actions/report" 
import { ReportPdf } from "@/components/report-pdf"
import { MoreHorizontal, Trash, LayoutDashboard, Plus, DollarSign, Receipt, Share2, Check, FileText, Loader2 } from "lucide-react"

interface ClientActionsProps {
  clientSlug: string;
  clientId: string;
  clientName: string; 
  accessCode: string; 
  invoices: any[];
}

const printPageStyle = `
  @page { size: A4 portrait; margin: 0 !important; }
  @media print {
    html, body { margin: 0 !important; padding: 0 !important; background-color: #0B1437 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
`;

export function ClientActions({ clientSlug, clientId, clientName, accessCode, invoices }: ClientActionsProps) {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  // Estado para armazenar o objeto completo retornado pela action
  const [fullReportData, setFullReportData] = useState<{ sites: any[], invoices: any[] } | null>(null)
  
  const printRef = useRef<HTMLDivElement>(null)

  const pendingCount = invoices ? invoices.filter(i => i.status === 'PENDING').length : 0;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Relatorio-Completo-${clientName.replace(/\s+/g, '-')}`,
    pageStyle: printPageStyle,
  })

  const generateReport = async () => {
    setIsGeneratingPdf(true)
    try {
      const data = await getClientReportDataAction(clientSlug)
      
      if (data && data.sites.length > 0) {
        setFullReportData(data) // Salva sites + faturas
        setTimeout(() => {
          handlePrint()
          setIsGeneratingPdf(false)
        }, 1000)
      } else {
        alert("Não foi possível gerar o relatório. Verifique se o cliente possui sites cadastrados.")
        setIsGeneratingPdf(false)
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao gerar relatório.")
      setIsGeneratingPdf(false)
    }
  }

  const handleCopyInvite = () => {
    const baseUrl = window.location.origin;
    const magicLink = `${baseUrl}/api/auth/invite?u=${clientSlug}&c=${accessCode}`;
    const message = `Olá! 👋\n\nAqui está o link de acesso direto ao seu *Painel de Monitoramento*.\n\nBasta clicar para entrar (não precisa de senha):\n${magicLink}\n\n⚠️ Por segurança, ao acessar, recomendo clicar em "Trocar Acesso" e definir sua própria senha.`;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <CreateInvoiceDialog clientId={clientId} open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen} />
      <AddSiteDialog clientSlug={clientSlug} open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen} />

      {/* ÁREA OCULTA PARA RENDERIZAR O PDF */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {fullReportData && (
            <ReportPdf 
              clientName={clientName} 
              sitesData={fullReportData.sites} 
              invoices={fullReportData.invoices} 
            />
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted relative">
            <span className="sr-only">Abrir menu</span>
            {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MoreHorizontal className="h-4 w-4" />}
            {!isGeneratingPdf && pendingCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[220px] bg-card border-border">
          {/* ... itens de menu iguais ... */}
          <DropdownMenuLabel>Ações do Cliente</DropdownMenuLabel>
          
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted">
            <Link href={`/dashboard/${clientSlug}`} className="flex items-center w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Acessar Painel</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyInvite} className="cursor-pointer focus:bg-muted text-primary focus:text-primary">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
            <span>{copied ? "Copiado!" : "Copiar Link de Convite"}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          {/* BOTÃO GERAR PDF */}
          <DropdownMenuItem 
            onClick={(e) => { e.preventDefault(); generateReport(); }} 
            disabled={isGeneratingPdf}
            className="cursor-pointer focus:bg-muted text-blue-500 focus:text-blue-600"
          >
            {isGeneratingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            <span>{isGeneratingPdf ? "Gerando Dossiê..." : "Gerar Relatório PDF"}</span>
          </DropdownMenuItem>

          <div onSelect={(e) => e.preventDefault()}>
             <ManageInvoicesDialog invoices={invoices || []}>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted hover:text-accent-foreground cursor-pointer">
                    <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Faturas</span>
                    {pendingCount > 0 && (
                        <span className="bg-yellow-500/20 text-yellow-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-auto">{pendingCount}</span>
                    )}
                </div>
             </ManageInvoicesDialog>
          </div>

          <DropdownMenuItem onSelect={() => setIsInvoiceOpen(true)} className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-500/10">
             <DollarSign className="mr-2 h-4 w-4" />
             <span>Gerar Cobrança</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem onSelect={() => setIsAddSiteOpen(true)} className="cursor-pointer focus:bg-muted">
             <Plus className="mr-2 h-4 w-4" />
             <span>Adicionar Site</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          <form action={deleteClientAction} className="w-full">
              <input type="hidden" name="clientId" value={clientId} />
              <DropdownMenuItem asChild>
                  <button 
                    type="submit" 
                    className="flex items-center w-full text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                    onClick={(e) => { if (!confirm("Tem certeza?")) e.preventDefault(); }}
                  >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Remover Cliente</span>
                  </button>
              </DropdownMenuItem>
          </form>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}