import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DealForm } from "./deal-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<{ buyerId?: string; propertyId?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const resolvedParams = await searchParams;
  const buyers = await prisma.buyer.findMany({
    where: { userId: session.user.id },
  })

  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light text-slate-900">Start New Deal</h1>
        <p className="text-slate-500 mt-2">
          Connect a buyer with a property to begin the deal workflow.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <DealForm
          buyers={buyers}
          properties={properties}
          defaultBuyerId={resolvedParams.buyerId}
          defaultPropertyId={resolvedParams.propertyId}
        />
      </div>
    </div>
  )
}