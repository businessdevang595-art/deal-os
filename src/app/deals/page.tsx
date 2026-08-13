import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "../dashboard/layout";

const STAGES = ["Qualified", "Matched", "Site Visit", "Offer", "Negotiation", "Closing", "Closed", "Lost"];

export default async function DealsPipelinePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    include: {
      buyer: true,
      property: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 h-full flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Deals Pipeline</h1>
          <p className="text-slate-500 mt-1">Track and manage active deals</p>
        </div>

        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage);
              
              return (
                <div key={stage} className="w-80 flex flex-col h-full bg-slate-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-700">{stage}</h3>
                    <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {stageDeals.map(deal => (
                      <Link href={`/deals/${deal.id}`} key={deal.id}>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 transition cursor-pointer group">
                          <p className="font-semibold text-sm text-slate-900 mb-1">{deal.property.title}</p>
                          <p className="text-xs text-slate-500 mb-3">{deal.buyer.name}</p>
                          {deal.amount && (
                            <div className="text-sm font-bold text-slate-700 bg-slate-50 inline-block px-2 py-1 rounded">
                              ₹{(deal.amount / 100000).toFixed(1)}L
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
