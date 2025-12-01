"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { updateSiteAction } from "@/app/actions/client"
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
import { Loader2, Globe, Pencil } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-white">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar Alterações"}
    </Button>
  )
}

interface EditSiteDialogProps {
  site: {
    id: string;
    name: string;
    url: string;
    apiToken: string;
  };
}

export function EditSiteDialog({ site }: EditSiteDialogProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const res = await updateSiteAction(formData)
    if (res?.success) {
      setOpen(false)
    } else {
      alert(res?.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
            title="Editar informações do site"
        >
            <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Editar Site</DialogTitle>
          <DialogDescription>
            Altere o nome, URL ou token de conexão.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="siteId" value={site.id} />

          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Site</Label>
            <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" defaultValue={site.name} className="pl-9 bg-background" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">URL do WordPress</Label>
            <Input id="url" name="url" type="url" defaultValue={site.url} className="bg-background" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apiToken">Token do Plugin</Label>
            <Input id="apiToken" name="apiToken" defaultValue={site.apiToken} className="bg-background font-mono text-sm" />
          </div>

          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}