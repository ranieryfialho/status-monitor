import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("u");
  const code = searchParams.get("c");

  if (!slug || !code) {
    return NextResponse.json({ error: "Link de convite inválido." }, { status: 400 });
  }

  const client = await prisma.client.findUnique({
    where: { slug }
  });

  if (!client || client.accessCode !== code) {
    return NextResponse.json({ error: "Link expirado ou credenciais inválidas." }, { status: 401 });
  }

  const dashboardUrl = new URL(`/dashboard/${client.slug}`, request.url);
  
  const response = NextResponse.redirect(dashboardUrl);

  response.cookies.set('client_session', client.slug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  response.cookies.delete('admin_session');

  return response;
}