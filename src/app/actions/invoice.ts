'use server'

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function createInvoiceAction(formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const clientId = formData.get("clientId") as string
  const description = formData.get("description") as string
  const amountString = formData.get("amount") as string
  const paymentUrl = formData.get("paymentUrl") as string
  const dueDateString = formData.get("dueDate") as string

  if (!clientId || !description || !amountString || !paymentUrl || !dueDateString) {
    return { error: true, message: "Preencha todos os campos, incluindo vencimento e link." }
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

export async function toggleInvoiceStatusAction(invoiceId: string, currentStatus: string) {
  const newStatus = currentStatus === 'PENDING' ? 'PAID' : 'PENDING';
  
  try {
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus },
      include: { client: true }
    });

    revalidatePath("/admin");
    revalidatePath(`/dashboard/${updatedInvoice.client.slug}`);
    
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