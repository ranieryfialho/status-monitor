"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addSiteAction } from "@/app/actions/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Globe, Plus } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Adicionar Site"}
    </Button>
  )
}

// --- AQUI ESTÁ A CORREÇÃO NECESSÁRIA ---
interface AddSiteDialogProps {
  clientSlug: string;
  children?: React.ReactNode; // <--- Isso permite passar o botão customizado
}

export function AddSiteDialog({ clientSlug, children }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const res = await addSiteAction(formData)
    if (res?.success) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Se existir um filho (botão da tabela), usa ele. Se não, usa o cartão padrão */}
        {children ? children : (
          <div className="h-full border-2 border-dashed border-primary/30 bg-primary/5 rounded-[20px] flex items-center justify-center min-h-[200px] hover:bg-primary/10 transition-colors cursor-pointer group">
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-primary">Novo Site</h3>
              <p className="text-xs text-muted-foreground mt-1">Adicionar ao painel</p>
            </div>
          </div>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Vincular Novo Site</DialogTitle>
          <DialogDescription>
            Adicione um novo site para este cliente.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="clientSlug" value={clientSlug} />

          <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium flex items-center gap-2 text-primary">
              <Globe className="h-4 w-4" /> Informações do Site
            </h4>
            
            <div className="grid gap-2">
              <Label htmlFor="siteName">Nome do Negócio</Label>
              <Input id="siteName" name="siteName" placeholder="Ex: Filial Centro" required className="bg-background" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="siteUrl">URL do Site</Label>
              <Input id="siteUrl" name="siteUrl" placeholder="https://..." required className="bg-background" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteToken">Token do Plugin</Label>
              <Input id="siteToken" name="siteToken" type="password" placeholder="Chave da API (Opcional)" className="bg-background" />
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