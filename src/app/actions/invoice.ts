'use server'

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

// --- AÇÃO 1: CRIAR FATURA ---
export async function createInvoiceAction(formData: FormData) {
  // Simula delay visual
  await new Promise(resolve => setTimeout(resolve, 1000))

  const clientId = formData.get("clientId") as string
  const description = formData.get("description") as string
  const amountString = formData.get("amount") as string
  const paymentUrl = formData.get("paymentUrl") as string

  if (!clientId || !description || !amountString || !paymentUrl) {
    return { error: true, message: "Preencha todos os campos, incluindo o link." }
  }

  const amount = parseFloat(amountString.replace(',', '.'))
  
  if (isNaN(amount) || amount <= 0) {
    return { error: true, message: "Valor inválido." }
  }

  try {
    await prisma.invoice.create({
      data: {
        description,
        amount,
        paymentUrl,
        clientId,
        status: "PENDING"
      }
    })

    revalidatePath("/admin")
    return { success: true, message: "Cobrança registrada com sucesso!" }

  } catch (error) {
    console.error("Erro ao criar fatura:", error)
    return { error: true, message: "Erro ao salvar no banco." }
  }
}

// --- AÇÃO 2: ALTERAR STATUS (DAR BAIXA) ---
export async function toggleInvoiceStatusAction(invoiceId: string, currentStatus: string) {
  const newStatus = currentStatus === 'PENDING' ? 'PAID' : 'PENDING';
  
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus },
      include: { client: true } // Necessário para saber qual dashboard atualizar
    });

    revalidatePath("/admin");
    revalidatePath(`/dashboard/${updatedInvoice.client.slug}`); // Atualiza o painel do cliente
    
    return { success: true, message: "Status atualizado!" };
  } catch (error) {
    console.error("Erro ao atualizar status:", error)
    return { error: true, message: "Erro ao atualizar." };
  }
}

// --- AÇÃO 3: EXCLUIR FATURA ---
export async function deleteInvoiceAction(invoiceId: string) {
  try {
    const deletedInvoice = await prisma.invoice.delete({
      where: { id: invoiceId },
      include: { client: true }
    });

    revalidatePath("/admin");
    revalidatePath(`/dashboard/${deletedInvoice.client.slug}`);
    
    return { success: true, message: "Fatura removida!" };
  } catch (error) {
    console.error("Erro ao excluir fatura:", error)
    return { error: true, message: "Erro ao excluir." };
  }
}