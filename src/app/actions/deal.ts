"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createDeal(buyerId: string, propertyId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const deal = await prisma.deal.create({
    data: {
      userId: session.user.id,
      buyerId,
      propertyId,
      stage: "Qualified",
    },
  });

  revalidatePath("/deals");
  return { success: true, id: deal.id };
}

export async function updateDealStage(dealId: string, newStage: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.deal.update({
    where: { id: dealId, userId: session.user.id },
    data: { stage: newStage },
  });

  revalidatePath(`/deals`);
  revalidatePath(`/deals/${dealId}`);
  return { success: true };
}

export async function createOffer(dealId: string, amount: number, notes: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const deal = await prisma.deal.findUnique({
    where: { id: dealId, userId: session.user.id }
  });

  if (!deal) throw new Error("Unauthorized");

  await prisma.offer.create({
    data: {
      dealId,
      amount,
      submittedBy: "Buyer", // Simplified for demo
      notes,
    },
  });

  // Update current deal amount
  await prisma.deal.update({
    where: { id: dealId, userId: session.user.id },
    data: { amount },
  });

  revalidatePath(`/deals/${dealId}`);
  return { success: true };
}
