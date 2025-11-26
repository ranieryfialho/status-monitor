"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

const initialState = {
  message: '',
  error: false
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 transition-colors duration-300">
      <Card className="w-full max-w-[400px] shadow-2xl border-none bg-card">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Status Monitor
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Painel de controle para clientes
          </CardDescription>
        </CardHeader>
        
        <form action={formAction}>
          <CardContent className="grid gap-6">
            
            {state?.error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg animate-accordion-down">
                <AlertCircle className="h-4 w-4" />
                <p>{state.message}</p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="token" className="text-sm font-semibold text-foreground/80">
                Token de Acesso
              </Label>
              <Input
                id="token"
                name="token"
                type="password"
                placeholder="Insira sua chave de acesso"
                className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" 
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Acessar Dashboard"
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Problemas com o acesso?{" "}
              <Link href="#" className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline">
                Contate o suporte
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}