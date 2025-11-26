"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Package } from "lucide-react"
import { UpdateLog } from "@/types/api"

interface UpdatesTableProps {
  logs: UpdateLog[]
}

export function UpdatesTable({ logs }: UpdatesTableProps) {
  return (
    <Card className="border-none shadow-lg bg-card rounded-[20px] overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Package className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Histórico de Atualizações
          </CardTitle>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
          {logs.length} atualizações neste período
        </Badge>
      </CardHeader>
      
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="pl-6 h-12 text-muted-foreground font-medium">Nome do Plugin</TableHead>
              <TableHead className="h-12 text-muted-foreground font-medium">Versão</TableHead>
              <TableHead className="h-12 text-muted-foreground font-medium">Data</TableHead>
              <TableHead className="h-12 text-muted-foreground font-medium text-right pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow 
                key={index} 
                className="border-border/50 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="pl-6 font-medium text-foreground">
                  {log.plugin}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Badge variant="outline" className="font-mono text-xs border-border/50 bg-background/50">
                    {log.versao}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(log.data).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs font-medium">Sucesso</span>
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