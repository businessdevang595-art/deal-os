import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../../dashboard/layout";
import { calculateMatch } from "@/lib/matching";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BuyerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const buyer = await prisma.buyer.findUnique({
    where: { id: (await params).id, userId: session.user.id },
  });

  if (!buyer) redirect("/buyers");

  // Fetch all properties to run matching
  const properties = await prisma.property.findMany({
    where: { userId: session.user.id }
  });

  const matches = properties.map(p => ({
    property: p,
    match: calculateMatch(buyer, p)
  })).sort((a, b) => b.match.score - a.match.score).slice(0, 5); // Top 5 matches

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{buyer.name}</h1>
            <p className="text-slate-500 mt-1">{buyer.email} • {buyer.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h2 className="text-lg font-semibold mb-4">Requirement</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Budget</span>
                  <span className="font-medium">₹{(buyer.minBudget!/100000).toFixed(0)}L - ₹{(buyer.maxBudget!/100000).toFixed(0)}L</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Type</span>
                  <span className="font-medium">{buyer.bedrooms} BHK {buyer.propertyType}</span>
                </div>
              </div>
              
              {buyer.notes && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Notes</p>
                  <p className="text-sm text-slate-700">{buyer.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> 
                Smart Matches
              </h2>
              
              {matches.length === 0 ? (
                <p className="text-slate-500">No properties in inventory to match.</p>
              ) : (
                <div className="space-y-4">
                  {matches.map((m) => (
                    <div key={m.property.id} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div>
                        <h3 className="font-semibold text-slate-900">{m.property.title}</h3>
                        <p className="text-sm text-slate-500">₹{(m.property.askingPrice / 100000).toFixed(1)}L • {m.property.locality}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                        <div className="text-right">
                          <div className={`text-xl font-bold ${m.match.score >= 80 ? 'text-green-600' : m.match.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                            {m.match.score}%
                          </div>
                          <div className="text-xs text-slate-400">Match Score</div>
                        </div>
                        
                        <form action={async () => {
                          "use server";
                          // Logic to create a deal would go here, omitting for brevity, using link instead.
                        }}>
                          <Link href={`/deals/new?buyerId=${buyer.id}&propertyId=${m.property.id}`}>
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                              Start Deal
                            </Button>
                          </Link>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
