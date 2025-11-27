"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, ExternalLink, CheckCircle2 } from "lucide-react"

// Interface local para a fatura
interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  status: string;
  paymentUrl: string | null;
  createdAt: Date;
}

interface InvoiceListProps {
  invoices: InvoiceItem[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  // Filtra apenas as pendentes para dar destaque (ou mostra todas se preferir)
  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');

  if (pendingInvoices.length === 0) return null; // Se não tiver conta, não mostra nada

  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-lg bg-card rounded-[20px] mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-yellow-500">
          <Receipt className="h-5 w-5" />
          <CardTitle className="text-lg font-bold text-foreground">
            Faturas em Aberto
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingInvoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 gap-4">
              
              <div>
                <p className="font-medium text-foreground">{invoice.description}</p>
                <p className="text-xs text-muted-foreground">
                  Gerada em {new Date(invoice.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-bold text-lg text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount)}
                </span>
                
                {invoice.paymentUrl && (
                  <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                    <a href={invoice.paymentUrl} target="_blank" rel="noopener noreferrer">
                      Pagar Agora <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>

            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}