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
}

export function AddSiteDialog({ clientSlug, children }: AddSiteDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const res = await addSiteAction(formData)
    if (res?.success) {
      setOpen(false)
    } else {
      alert(res?.message || "Erro ao adicionar site")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      
      <DialogContent className="sm:max-w-[450px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Vincular Novo Site</DialogTitle>
          <DialogDescription>
            Preencha os dados para monitorar um novo WordPress.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-5 py-4">
          
          <input type="hidden" name="clientSlug" value={clientSlug} />

          <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium flex items-center gap-2 text-primary">
              <Globe className="h-4 w-4" /> Dados de Conexão
            </h4>
            
            <div className="grid gap-2">
              <Label htmlFor="siteName">Nome do Negócio</Label>
              <Input 
                id="siteName" 
                name="siteName" 
                placeholder="Ex: Padaria Central" 
                required 
                className="bg-background" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="siteUrl">URL do WordPress</Label>
              <Input 
                id="siteUrl" 
                name="siteUrl" 
                type="url"
                placeholder="https://meusite.com.br" 
                required 
                className="bg-background" 
              />
              <p className="text-[10px] text-muted-foreground">Cole a URL exata do site (com https)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteToken" className="flex items-center gap-2">
                Token do Plugin <Lock className="h-3 w-3 text-muted-foreground"/>
              </Label>
              <Input 
                id="siteToken" 
                name="siteToken" 
                type="password" 
                placeholder="Cole o código gerado pelo plugin aqui" 
                className="bg-background font-mono text-sm" 
              />
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