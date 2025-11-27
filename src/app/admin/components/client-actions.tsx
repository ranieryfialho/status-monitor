"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddSiteDialog } from "@/components/add-site-dialog"
import { deleteClientAction } from "@/app/actions/client"
import { MoreHorizontal, Trash, LayoutDashboard, Plus } from "lucide-react"

interface ClientActionsProps {
  clientSlug: string;
  clientId: string;
}

export function ClientActions({ clientSlug, clientId }: ClientActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-card border-border">
        <DropdownMenuLabel>Ações do Cliente</DropdownMenuLabel>
        
        {/* 1. ACESSAR CONTA */}
        <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted">
          <Link href={`/dashboard/${clientSlug}`} className="flex items-center w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Acessar Painel</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        {/* 2. ADICIONAR SITE (MODAL) */}
        {/* preventDefault evita que o dropdown feche antes do modal abrir */}
        <div onSelect={(e) => e.preventDefault()}>
            <AddSiteDialog clientSlug={clientSlug}>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Adicionar Site</span>
                </div>
            </AddSiteDialog>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* 3. DELETAR CLIENTE */}
        <form action={deleteClientAction} className="w-full">
            <input type="hidden" name="clientId" value={clientId} />
            <DropdownMenuItem asChild>
                <button 
                  type="submit" 
                  className="flex items-center w-full text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                  onClick={(e) => {
                    if (!confirm("Tem certeza que deseja excluir este cliente e todos os sites dele?")) {
                      e.preventDefault();
                    }
                  }}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Remover Cliente</span>
                </button>
            </DropdownMenuItem>
        </form>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}