"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { createInvoiceAction } from "@/app/actions/invoice"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Registrar Cobrança"}
    </Button>
  )
}

interface CreateInvoiceDialogProps {
  clientId: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateInvoiceDialog({ clientId, children, open: controlledOpen, onOpenChange: setControlledOpen }: CreateInvoiceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = setControlledOpen ?? setInternalOpen

  async function handleSubmit(formData: FormData) {
    const res = await createInvoiceAction(formData)
    if (res?.success) {
      setIsOpen(false)
    } else {
      alert(res?.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Nova Cobrança</DialogTitle>
          <DialogDescription>
            Defina o valor, vencimento e o link de pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="clientId" value={clientId} />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" placeholder="Ex: Manutenção Out/2025" required className="bg-background" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" placeholder="R$ 150,00" required className="bg-background font-mono" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="dueDate">Vencimento</Label>
                    <Input id="dueDate" name="dueDate" type="date" required className="bg-background" />
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentUrl">Link InfinitePay</Label>
              <Input id="paymentUrl" name="paymentUrl" type="url" placeholder="Informe o link de pagamento" required className="bg-background" />
            </div>
          </div>

          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}