"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { updateClientAction } from "@/app/actions/client"
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
import { Loader2, User, Lock } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-white">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar Alterações"}
    </Button>
  )
}

interface EditClientDialogProps {
  client: {
    id: string;
    name: string;
    slug: string;
    accessCode: string;
  };
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditClientDialog({ client, children, open: controlledOpen, onOpenChange: setControlledOpen }: EditClientDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = setControlledOpen ?? setInternalOpen

  async function handleSubmit(formData: FormData) {
    const res = await updateClientAction(formData)
    if (res?.success) {
      setIsOpen(false)
    } else {
      alert(res?.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[450px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações de acesso do gestor.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="grid gap-4 py-4">
          <input type="hidden" name="clientId" value={client.id} />

          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Gestor</Label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" defaultValue={client.name} className="pl-9 bg-background" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (Login URL)</Label>
            <Input id="slug" name="slug" defaultValue={client.slug} className="bg-background" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accessCode">Código de Acesso</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="accessCode" name="accessCode" defaultValue={client.accessCode} className="pl-9 bg-background" required />
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