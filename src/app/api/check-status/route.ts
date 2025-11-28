import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, token } = await request.json();

    const cleanUrl = url.replace(/\/$/, ""); 
    const endpoint = `${cleanUrl}/wp-json/status-monitor/v1/check`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Status-Token": token,
        "User-Agent": "StatusMonitor/1.0",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return NextResponse.json({ status: "online" });
    } else {
      console.error(`Erro ${res.status} ao acessar ${endpoint}`);
      return NextResponse.json({ status: "offline" }, { status: 200 });
    }
  } catch (error) {
    console.error(`Erro de conexão:`, error);
    return NextResponse.json({ status: "offline" }, { status: 200 });
  }
}