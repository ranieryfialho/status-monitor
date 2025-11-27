"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addClientAction } from "@/app/actions/client"
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
import { Plus, Loader2, Globe, User, Lock } from "lucide-react"

// Componente botão de submit com estado de loading
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Cadastrar Cliente"}
    </Button>
  )
}

export function AddClientDialog() {
  const [open, setOpen] = useState(false)

  // Wrapper para fechar o modal após sucesso
  async function handleSubmit(formData: FormData) {
    const res = await addClientAction(formData)
    if (res?.success) {
      setOpen(false) // Fecha o modal
      // Aqui você poderia adicionar um Toast/Notificação de sucesso
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Crie um acesso para um gestor e vincule o primeiro site dele.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          
          {/* SEÇÃO 1: DADOS DO GESTOR */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium flex items-center gap-2 text-primary">
              <User className="h-4 w-4" /> Dados de Acesso
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Gestor</Label>
                <Input id="name" name="name" placeholder="Ex: Pedro Silva" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (Login)</Label>
                <Input id="slug" name="slug" placeholder="Ex: pedro-silva" required />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="accessCode">Senha de Acesso</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="accessCode" name="accessCode" type="text" className="pl-9" placeholder="Senha para ele logar" required />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: PRIMEIRO SITE */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium flex items-center gap-2 text-primary">
              <Globe className="h-4 w-4" /> Primeiro Site
            </h4>
            
            <div className="grid gap-2">
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input id="siteName" name="siteName" placeholder="Ex: Padaria Central" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="siteUrl">URL do WordPress</Label>
              <Input id="siteUrl" name="siteUrl" placeholder="https://..." required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteToken">Token do Plugin (API Key)</Label>
              <Input id="siteToken" name="siteToken" type="password" placeholder="Cole a chave do plugin aqui" required />
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