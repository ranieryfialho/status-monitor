"use client"

import { useEffect, useState, useRef } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"

interface UptimeMonitorProps {
  initialStatus: "online" | "offline";
  siteUrl: string;
  apiToken: string;
}

type PingStatus = {
  status: "online" | "offline";
  timestamp: string;
};

export function UptimeMonitor({ initialStatus, siteUrl, apiToken }: UptimeMonitorProps) {
  const [currentStatus, setCurrentStatus] = useState<"online" | "offline">(initialStatus);
  const [pings, setPings] = useState<PingStatus[]>([]);
  const [downtimeSeconds, setDowntimeSeconds] = useState(0);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/check-status", {
          method: "POST",
          body: JSON.stringify({ url: siteUrl, token: apiToken }),
        });
        const data = await res.json();
        
        updateGraph(data.status);
      } catch (error) {
        updateGraph("offline");
      }
    };

    const updateGraph = (newStatus: "online" | "offline") => {
      setCurrentStatus(newStatus);
      
      const newPing: PingStatus = {
        status: newStatus,
        timestamp: new Date().toLocaleTimeString(),
      };

      setPings((prev) => {
        const newHistory = [...prev, newPing];
        if (newHistory.length > 60) return newHistory.slice(newHistory.length - 60);
        return newHistory;
      });

      if (newStatus === "offline") {
        setDowntimeSeconds(prev => prev + 1);
      } else {
        setDowntimeSeconds(0);
      }
    };

    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [siteUrl, apiToken]);

  const emptySlots = 60 - pings.length;
  const displayPings = [
    ...Array(emptySlots > 0 ? emptySlots : 0).fill({ status: "pending", timestamp: "-" }),
    ...pings
  ];

  const isOffline = currentStatus === "offline";

  return (
    <Card className={`h-full shadow-lg bg-card rounded-[20px] flex flex-col transition-colors duration-300 ${isOffline ? 'border-2 border-red-500/50' : 'border-none'}`}>
      <CardHeader className="px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${isOffline ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <Activity className={`h-4 w-4 ${isOffline ? '' : 'animate-pulse'}`} />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">
            Monitor Real-Time
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-2">
            {isOffline ? (
                <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 rounded-md border border-red-500/20 animate-pulse">
                    <Clock className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-bold text-red-500 font-mono">
                        OFFLINE: {downtimeSeconds}s
                    </span>
                </div>
            ) : (
                <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    Conectado
                </span>
            )}
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col justify-end h-full">
        <div className="flex items-end justify-end gap-[3px] h-16 w-full overflow-hidden">
            <TooltipProvider>
                {displayPings.map((ping, index) => {
                    let barColor = "bg-muted/30"; 
                    let height = "20%"; 

                    if (ping.status === "online") {
                        barColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"; 
                        height = "60%";
                    } else if (ping.status === "offline") {
                        barColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
                        height = "100%";
                    }

                    return (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div 
                                    className={`w-full min-w-[4px] rounded-sm transition-all duration-300 ${barColor}`}
                                    style={{ height: height }} 
                                />
                            </TooltipTrigger>
                            {ping.status !== "pending" && (
                                <TooltipContent>
                                    <p className="text-xs font-bold">{ping.timestamp}</p>
                                    <p className="text-xs">{ping.status.toUpperCase()}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    )
                })}
            </TooltipProvider>
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground uppercase tracking-widest">
            <span>60s atrás</span>
            <span>Agora</span>
        </div>
      </CardContent>
    </Card>
  )
}