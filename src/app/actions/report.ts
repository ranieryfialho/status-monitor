'use server'

import prisma from "@/lib/prisma"
import { fetchSiteData } from "../dashboard/[client]/lib/api"

export async function getClientReportDataAction(clientSlug: string) {
  const client = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { 
      sites: true,
      invoices: {
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!client || client.sites.length === 0) {
    return null
  }

  const sitesData = await Promise.all(
    client.sites.map(async (site) => {
      const data = await fetchSiteData(clientSlug, site.id)
      
      if (!data) {
        return {
          id: site.id,
          name: site.name,
          url: site.url,
          status: "offline",
          lastCheck: new Date().toISOString(),
          sistema: { nome_site: site.name, url: site.url, wp_version: "-", php: "-", ip: "-" },
          logs_recentes: [],
          backup: { ativo: false },
          plugins_instalados: []
        }
      }

      return {
        ...data,
        id: site.id,
        name: site.name,
        status: "online",
        lastCheck: new Date().toISOString(),
      }
    })
  )

  return {
    sites: sitesData,
    invoices: client.invoices
  }
}

export async function getSingleSiteReportDataAction(clientSlug: string, siteId: string) {
  const client = await prisma.client.findUnique({
    where: { slug: clientSlug },
    include: { 
      sites: {
        where: { id: siteId }
      },
      invoices: {
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!client || client.sites.length === 0) {
    return null
  }

  const site = client.sites[0]
  const data = await fetchSiteData(clientSlug, site.id)
  
  const siteReportData = {
    id: site.id,
    name: site.name,
    url: site.url,
    status: data ? "online" : "offline",
    lastCheck: new Date().toISOString(),
    ...(data || {
      sistema: { nome_site: site.name, url: site.url, wp_version: "-", php: "-", ip: "-" },
      logs_recentes: [],
      backup: { ativo: false },
      plugins_instalados: []
    })
  }

  return {
    sites: [siteReportData],
    invoices: client.invoices
  }
}