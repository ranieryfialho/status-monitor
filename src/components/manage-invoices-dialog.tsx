"use client"

import { useState } from "react"
import { toggleInvoiceStatusAction, deleteInvoiceAction } from "@/app/actions/invoice"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Trash2, Clock, Receipt } from "lucide-react"

// Interface para garantir a tipagem correta
interface Invoice {
  id: string;
  description: string;
  amount: number;
  status: string;
  createdAt: Date;
}

interface ManageInvoicesDialogProps {
  invoices: Invoice[];
  children: React.ReactNode;
}

export function ManageInvoicesDialog({ invoices, children }: ManageInvoicesDialogProps) {
  const [open, setOpen] = useState(false)

  // Função para mudar status (Pendente <-> Pago)
  async function handleToggle(id: string, currentStatus: string) {
    await toggleInvoiceStatusAction(id, currentStatus)
  }

  // Função para deletar
  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja apagar esta cobrança?")) {
      await deleteInvoiceAction(id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Gerenciar Cobranças</DialogTitle>
          <DialogDescription>
            Histórico de faturas deste cliente. Clique no status para alterar.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px] pr-4">
          {invoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
              <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Nenhuma cobrança registrada para este cliente.
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  
                  {/* Informações da Fatura */}
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-foreground">{inv.description}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(inv.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2">
                    
                    {/* Botão de Status (Toggle) */}
                    <Button 
                      variant={inv.status === 'PAID' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(inv.id, inv.status)}
                      className={`h-8 gap-1.5 transition-all ${
                        inv.status === 'PAID' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700'
                      }`}
                    >
                      {inv.status === 'PAID' ? (
                        <><CheckCircle2 className="h-3 w-3" /> Pago</>
                      ) : (
                        <><Clock className="h-3 w-3" /> Pendente</>
                      )}
                    </Button>

                    {/* Botão Deletar */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(inv.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      title="Excluir fatura"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}