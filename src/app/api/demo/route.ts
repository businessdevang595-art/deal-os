import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Clear existing demo data (or all user data for simplicity in demo context)
    await prisma.deal.deleteMany({ where: { userId } });
    await prisma.property.deleteMany({ where: { userId } });
    await prisma.buyer.deleteMany({ where: { userId } });

    // Seed Properties
    const p1 = await prisma.property.create({
      data: {
        userId,
        title: "Luxury 3BHK in Civil Lines",
        propertyType: "Apartment",
        address: "101 Grand Avenue",
        locality: "Civil Lines",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        askingPrice: 8200000,
        description: "A premium 3BHK with excellent ventilation and modern amenities."
      }
    });

    const p2 = await prisma.property.create({
      data: {
        userId,
        title: "Modern Villa with Pool",
        propertyType: "Villa",
        address: "45 Palm Drive",
        locality: "Juhu",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400049",
        bedrooms: 4,
        bathrooms: 4,
        area: 3200,
        askingPrice: 15000000,
        description: "Spacious independent villa featuring a private pool and garden."
      }
    });

    // Seed Buyers
    const b1 = await prisma.buyer.create({
      data: {
        userId,
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        minBudget: 7500000,
        maxBudget: 8500000,
        propertyType: "Apartment",
        bedrooms: 3,
        minArea: 1600,
        maxArea: 2000,
      }
    });

    const b2 = await prisma.buyer.create({
      data: {
        userId,
        name: "Priya Patel",
        email: "priya@example.com",
        minBudget: 12000000,
        maxBudget: 18000000,
        propertyType: "Villa",
        bedrooms: 4,
      }
    });

    // Seed Deals
    await prisma.deal.create({
      data: {
        userId,
        buyerId: b1.id,
        propertyId: p1.id,
        stage: "Matched",
      }
    });

    const deal2 = await prisma.deal.create({
      data: {
        userId,
        buyerId: b2.id,
        propertyId: p2.id,
        stage: "Negotiation",
        amount: 14500000,
      }
    });

    // Seed Offers
    await prisma.offer.create({
      data: {
        dealId: deal2.id,
        amount: 14000000,
        submittedBy: "Buyer",
        notes: "Initial offer",
      }
    });

    await prisma.offer.create({
      data: {
        dealId: deal2.id,
        amount: 14500000,
        submittedBy: "Buyer",
        notes: "Revised offer after site visit",
      }
    });

    return NextResponse.json({ success: true, message: "Demo data generated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate demo data" }, { status: 500 });
  }
}
