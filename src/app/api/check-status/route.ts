import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, token } = await request.json();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${url}/wp-json/status-monitor/v1/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Status-Token": token,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      return NextResponse.json({ status: "online" });
    } else {
      return NextResponse.json({ status: "offline" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ status: "offline" }, { status: 200 });
  }
}