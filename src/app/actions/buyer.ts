"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const buyerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.coerce.number().int().optional(),
  minArea: z.coerce.number().optional(),
  maxArea: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export async function createBuyer(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const rawData = Object.fromEntries(formData);
  const validated = buyerSchema.parse(rawData);

  const buyer = await prisma.buyer.create({
    data: {
      ...validated,
      userId: session.user.id,
      preferredLocations: [],
    },
  });

  revalidatePath("/buyers");
  revalidatePath("/dashboard");
  return { success: true, id: buyer.id };
}
