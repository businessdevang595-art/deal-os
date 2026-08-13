"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(1),
  propertyType: z.string(),
  address: z.string(),
  locality: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number().int(),
  area: z.coerce.number(),
  askingPrice: z.coerce.number(),
  description: z.string().optional(),
});

export async function createProperty(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const rawData = Object.fromEntries(formData);
  const validated = propertySchema.parse(rawData);

  const property = await prisma.property.create({
    data: {
      ...validated,
      userId: session.user.id,
      amenities: [],
    },
  });

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true, id: property.id };
}

export async function deleteProperty(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.property.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/properties");
  revalidatePath("/dashboard");
  return { success: true };
}
