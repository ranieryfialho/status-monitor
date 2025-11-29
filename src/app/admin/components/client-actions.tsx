"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddSiteDialog } from "@/components/add-site-dialog"
import { CreateInvoiceDialog } from "@/components/create-invoice-dialog"
import { ManageInvoicesDialog } from "@/components/manage-invoices-dialog"
import { deleteClientAction } from "@/app/actions/client"
import { MoreHorizontal, Trash, LayoutDashboard, Plus, DollarSign, Receipt, Share2, Check } from "lucide-react"

interface ClientActionsProps {
  clientSlug: string;
  clientId: string;
  accessCode: string; 
  invoices: any[];
}

export function ClientActions({ clientSlug, clientId, accessCode, invoices }: ClientActionsProps) {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const pendingCount = invoices ? invoices.filter(i => i.status === 'PENDING').length : 0;

  // Função para copiar o convite mágico
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
      <CreateInvoiceDialog 
        clientId={clientId} 
        open={isInvoiceOpen} 
        onOpenChange={setIsInvoiceOpen} 
      />

      <AddSiteDialog 
        clientSlug={clientSlug} 
        open={isAddSiteOpen} 
        onOpenChange={setIsAddSiteOpen} 
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted relative">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
            {pendingCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[220px] bg-card border-border">
          <DropdownMenuLabel>Ações do Cliente</DropdownMenuLabel>
          
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted">
            <Link href={`/dashboard/${clientSlug}`} className="flex items-center w-full">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Acessar Painel</span>
            </Link>
          </DropdownMenuItem>

          {/* ITEM: COPIAR CONVITE */}
          <DropdownMenuItem onClick={handleCopyInvite} className="cursor-pointer focus:bg-muted text-primary focus:text-primary">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
            <span>{copied ? "Copiado!" : "Copiar Acesso Mágico"}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

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