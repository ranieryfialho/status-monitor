"use client"

import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MiniUptimeMonitorProps {
  url: string;
  token: string;
}

type PingStatus = {
  status: "online" | "offline";
  timestamp: string;
};

export function MiniUptimeMonitor({ url, token }: MiniUptimeMonitorProps) {
  const HISTORY_LENGTH = 20; 
  const [pings, setPings] = useState<PingStatus[]>([]);
  
  // Estado inicial já começa com placeholders para evitar "pulo" visual
  const [currentStatus, setCurrentStatus] = useState<"online" | "offline" | "loading">("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/check-status", {
          method: "POST",
          body: JSON.stringify({ url, token }),
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
        if (newHistory.length > HISTORY_LENGTH) return newHistory.slice(newHistory.length - HISTORY_LENGTH);
        return newHistory;
      });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [url, token]);

  const emptySlots = HISTORY_LENGTH - pings.length;
  const displayPings = [
    ...Array(emptySlots > 0 ? emptySlots : 0).fill({ status: "pending", timestamp: "-" }),
    ...pings
  ];

  return (
    // Removi o texto "Monitor / ON" e centralizei o container das barras
    <div className="flex items-center justify-center w-full h-full min-w-[120px]">
      <div className="flex items-end gap-[3px] h-6 w-full max-w-[140px] overflow-hidden">
        <TooltipProvider delayDuration={0}>
          {displayPings.map((ping, index) => {
            let barColor = "bg-muted/20";
            let height = "20%"; 

            if (ping.status === "online") {
              barColor = "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"; 
              height = "60%";
            } else if (ping.status === "offline") {
              barColor = "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]";
              height = "100%";
            }

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex-1 rounded-sm transition-all duration-500 ${barColor}`}
                    style={{ height: height }} 
                  />
                </TooltipTrigger>
                {ping.status !== "pending" && (
                  <TooltipContent side="top" className="text-[10px] p-1 px-2 border-none bg-popover text-popover-foreground shadow-xl">
                    <p className="font-bold uppercase tracking-wider text-primary">{ping.status}</p>
                    <p className="text-muted-foreground">{ping.timestamp}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}