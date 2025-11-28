import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, ArrowRight, LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { ChangePasswordDialog } from "@/components/change-password-dialog" // <--- NOVO IMPORT

export default async function ClientSitesPage({
  params,
}: {
  params: Promise<{ client: string }>
}) {
  const { client: clientSlug } = await params
  
  const clientUser = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { sites: true }
  })
  
  if (!clientUser) {
    notFound()
  }

  if (clientUser.sites.length === 1) {
     redirect(`/dashboard/${clientSlug}/${clientUser.sites[0].id}`)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">
            Painel do Gestor
          </h2>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bem-vindo, {clientUser.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Selecione um site abaixo para visualizar o relatório detalhado.
          </p>
        </div>

        {/* ÁREA DE AÇÕES DO CLIENTE */}
        <div className="flex items-center gap-2">
          
          {/* Botão de Trocar Senha */}
          <ChangePasswordDialog type="client" identifier={clientSlug} />

          <form action={logoutAction}>
            <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientUser.sites.map((site) => (
          <Link key={site.id} href={`/dashboard/${clientSlug}/${site.id}`} className="group">
            <Card className="h-full border-none shadow-lg bg-card rounded-[20px] transition-all hover:shadow-xl hover:scale-[1.02] hover:bg-card/90 cursor-pointer border border-transparent hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Globe className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-0">
                    Monitorado
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {site.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate mb-4">
                  {site.url}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Ver Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}