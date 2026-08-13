"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function scheduleVisit(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const buyerId = formData.get("buyerId") as string;
  const propertyId = formData.get("propertyId") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const notes = formData.get("notes") as string;

  if (!buyerId || !propertyId || !dateStr || !timeStr) {
    return { error: "Missing required fields" };
  }
  
  // Verify ownership
  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId, userId: session.user.id }});
  const property = await prisma.property.findUnique({ where: { id: propertyId, userId: session.user.id }});
  
  if (!buyer || !property) throw new Error("Unauthorized");

  const date = new Date(`${dateStr}T${timeStr}`);

  await prisma.siteVisit.create({
    data: {
      userId: session.user.id,
      buyerId,
      propertyId,
      date,
      notes,
    },
  });

  revalidatePath("/site-visits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addFeedback(visitId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const visit = await prisma.siteVisit.findUnique({ where: { id: visitId, userId: session.user.id } });
  if (!visit) throw new Error("Unauthorized");

  const reaction = formData.get("reaction") as string;
  const notes = formData.get("notes") as string;
  
  await prisma.siteVisitFeedback.create({
    data: {
      siteVisitId: visitId,
      reaction,
      nextAction: notes, // simplistic mapping for demo
    }
  });

  await prisma.siteVisit.update({
    where: { id: visitId, userId: session.user.id },
    data: { status: "Completed" }
  });

  revalidatePath("/site-visits");
  return { success: true };
}
