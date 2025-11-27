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
import { CheckCircle2, Loader2, AlertCircle, Lock, User } from "lucide-react"

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
            Acesse sua conta para gerenciar
          </CardDescription>
        </CardHeader>
        
        <form action={formAction}>
          <CardContent className="grid gap-4">
            
            {state?.error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg animate-accordion-down">
                <AlertCircle className="h-4 w-4" />
                <p>{state.message}</p>
              </div>
            )}

            {/* CAMPO 1: USUÁRIO OU EMAIL */}
            <div className="grid gap-2">
              <Label htmlFor="login" className="text-sm font-semibold text-foreground/80">
                Usuário ou Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="Informe seu email ou login"
                  className="pl-9 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                  required
                />
              </div>
            </div>

            {/* CAMPO 2: SENHA */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                  Senha
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                  required
                />
              </div>
            </div>

          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pb-8 pt-2">
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
                "Entrar no Sistema"
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Esqueceu sua senha?{" "}
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