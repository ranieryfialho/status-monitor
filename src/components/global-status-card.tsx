"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface SiteData {
  url: string;
  apiToken: string;
}

interface GlobalStatusCardProps {
  sites: SiteData[];
}

export function GlobalStatusCard({ sites }: GlobalStatusCardProps) {
  const [stats, setStats] = useState({ online: 0, offline: 0, total: 0, loading: true });

  useEffect(() => {
    let isMounted = true;

    const checkAllSites = async () => {
      if (sites.length === 0) {
        if (isMounted) setStats({ online: 0, offline: 0, total: 0, loading: false });
        return;
      }

      // Verifica todos os sites em paralelo
      const promises = sites.map(site => 
        fetch("/api/check-status", {
          method: "POST",
          body: JSON.stringify({ url: site.url, token: site.apiToken }),
          cache: "no-store" // Garante que não use cache
        })
        .then(res => res.json())
        .then(data => data.status === "online" ? "online" : "offline")
        .catch(() => "offline")
      );

      const results = await Promise.all(promises);
      
      if (isMounted) {
        setStats({
          online: results.filter(s => s === "online").length,
          offline: results.filter(s => s === "offline").length,
          total: sites.length,
          loading: false
        });
      }
    };

    // 1. Executa imediatamente ao carregar
    checkAllSites();

    // 2. Atualiza a cada 10 segundos (Real-time "vivo")
    const interval = setInterval(checkAllSites, 60000); 
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [sites]);

  // Cálculos de Porcentagem
  const total = stats.total > 0 ? stats.total : 1; // Evita divisão por zero
  const uptimePercent = ((stats.online / total) * 100).toFixed(1);
  const downtimePercent = ((stats.offline / total) * 100).toFixed(1);

  // Define a cor do ícone baseado na saúde geral
  const isCritical = stats.offline > 0;

  return (
    <Card className={`border-none shadow-lg bg-card rounded-[20px] transition-colors duration-500 ${isCritical ? 'border border-red-500/20' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Disponibilidade Global
        </CardTitle>
        {stats.loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : isCritical ? (
          <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        )}
      </CardHeader>
      
      <CardContent>
        {stats.loading ? (
           <div className="space-y-3 animate-pulse">
             <div className="h-7 w-20 bg-muted/50 rounded" />
             <div className="h-2 w-full bg-muted/50 rounded" />
           </div>
        ) : (
          <div className="space-y-3">
            
            {/* Valor Principal (Porcentagem de Uptime) */}
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${isCritical && stats.online < stats.total ? 'text-yellow-500' : 'text-foreground'}`}>
                {uptimePercent}%
              </span>
              <span className="text-xs text-muted-foreground font-medium uppercase">Uptime Total</span>
            </div>

            {/* Barra de Progresso Dividida (Visualização Viva) */}
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted/30">
              {/* Parte Verde (Online) */}
              <div 
                className="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-in-out" 
                style={{ width: `${uptimePercent}%` }} 
              />
              {/* Parte Vermelha (Offline) */}
              <div 
                className="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-1000 ease-in-out" 
                style={{ width: `${downtimePercent}%` }} 
              />
            </div>

            {/* Legenda Detalhada */}
            <div className="flex justify-between items-center text-[11px] font-medium">
              <div className="flex items-center gap-1.5 text-emerald-600/80">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {stats.online} Online
              </div>
              
              {parseFloat(downtimePercent) > 0 && (
                <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {downtimePercent}% Crítico ({stats.offline})
                </div>
              )}
            </div>

          </div>
        )}
      </CardContent>
    </Card>
  )
}