"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { changePasswordAction } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, KeyRound, Lock } from "lucide-react"

const initialState = {
  message: '',
  error: false,
  success: false
}

interface ChangePasswordDialogProps {
  type: 'admin' | 'client';
  identifier?: string;
}

export function ChangePasswordDialog({ type, identifier }: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState)

  useEffect(() => {
    if (state?.success) {
      setOpen(false)
      alert(state.message) // Ou use um Toast se tiver configurado
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <KeyRound className="h-4 w-4" />
          {type === 'admin' ? 'Trocar Senha' : 'Trocar Acesso'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Alterar Credenciais</DialogTitle>
          <DialogDescription>
            Digite sua senha atual para confirmar a alteração.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="grid gap-4 py-4">
          <input type="hidden" name="type" value={type} />
          {identifier && <input type="hidden" name="identifier" value={identifier} />}

          {state?.error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
              {state.message}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="currentPassword" 
                name="currentPassword" 
                type="password" 
                placeholder="••••••••" 
                className="pl-9" 
                required 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="newPassword" 
                name="newPassword" 
                type="password" 
                placeholder="••••••••" 
                className="pl-9" 
                required 
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
              ) : (
                "Confirmar Alteração"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}