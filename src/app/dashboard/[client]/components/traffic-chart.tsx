"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"

interface ChartData {
  name: string
  atual: number
  anterior: number
}

interface TrafficChartProps {
  data: ChartData[]
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <Card className="h-full border-none shadow-lg bg-card rounded-[20px] flex flex-col">
      <CardHeader className="px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <BarChart3 className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Sessões do Site
          </CardTitle>
        </div>
        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
          -8.3%
        </Badge>
      </CardHeader>

      <div className="flex-1 p-4 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              {/* Gradiente para a linha atual (Primary/Roxo) */}
              <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              {/* Gradiente para a linha anterior (Cinza) */}
              <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
                color: 'hsl(var(--foreground))'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="anterior" 
              name="Período Anterior"
              stroke="#94a3b8" 
              fillOpacity={1} 
              fill="url(#colorAnterior)" 
            />
            <Area 
              type="monotone" 
              dataKey="atual" 
              name="Este Período"
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorAtual)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}