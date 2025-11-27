"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addSiteAction } from "@/app/actions/client"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Globe, Plus, Lock } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Vincular Site"}
    </Button>
  )
}

interface AddSiteDialogProps {
  clientSlug: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddSiteDialog({ clientSlug, children, open: controlledOpen, onOpenChange: setControlledOpen }: AddSiteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = setControlledOpen ?? setInternalOpen

  async function handleSubmit(formData: FormData) {
    const res = await addSiteAction(formData)
    if (res?.success) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[450px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Vincular Novo Site</DialogTitle>
          <DialogDescription>Preencha os dados do novo WordPress.</DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-5 py-4">
          <input type="hidden" name="clientSlug" value={clientSlug} />

          <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium flex items-center gap-2 text-primary">
              <Globe className="h-4 w-4" /> Dados de Conexão
            </h4>
            <div className="grid gap-2">
              <Label htmlFor="siteName">Nome do Negócio</Label>
              <Input id="siteName" name="siteName" placeholder="Ex: Padaria Central" required className="bg-background" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siteUrl">URL do WordPress</Label>
              <Input id="siteUrl" name="siteUrl" type="url" placeholder="https://meusite.com.br" required className="bg-background" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="siteToken">Token do Plugin</Label>
              <Input id="siteToken" name="siteToken" type="password" placeholder="Código gerado pelo plugin" className="bg-background font-mono text-sm" />
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