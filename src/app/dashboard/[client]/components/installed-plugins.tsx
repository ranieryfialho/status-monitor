"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Blocks, CheckCircle2 } from "lucide-react"
import { InstalledPlugin } from "@/types/api"

interface InstalledPluginsProps {
  plugins: InstalledPlugin[]
}

export function InstalledPlugins({ plugins }: InstalledPluginsProps) {
  return (
    <Card className="border-none shadow-lg bg-card rounded-[20px] overflow-hidden h-full">
      <CardHeader className="px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Blocks className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Plugins Instalados
          </CardTitle>
        </div>
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-0">
          {plugins.length} ativos
        </Badge>
      </CardHeader>
      
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50 bg-muted/20">
              <TableHead className="pl-6 h-10 text-muted-foreground font-medium text-xs uppercase tracking-wider">Nome</TableHead>
              <TableHead className="h-10 text-muted-foreground font-medium text-xs uppercase tracking-wider">Versão</TableHead>
              <TableHead className="h-10 text-muted-foreground font-medium text-xs uppercase tracking-wider text-right pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plugins.map((plugin, index) => (
              <TableRow key={index} className="border-border/50 hover:bg-muted/30 transition-colors text-sm">
                <TableCell className="pl-6 font-medium text-foreground py-3">
                  {plugin.nome}
                  {plugin.autor && <span className="block text-[10px] text-muted-foreground font-normal">{plugin.autor}</span>}
                </TableCell>
                <TableCell className="text-muted-foreground py-3">
                  <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">v{plugin.versao}</span>
                </TableCell>
                <TableCell className="text-right pr-6 py-3">
                  <div className="flex items-center justify-end gap-1 text-emerald-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">Ativo</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}