import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Mail } from "lucide-react";
import DashboardLayout from "../dashboard/layout";

export default async function BuyersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const buyers = await prisma.buyer.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buyers</h1>
            <p className="text-slate-500 mt-1">Manage your pipeline of buyers</p>
          </div>
          <Link href="/buyers/new">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
              <Plus size={18} /> Add Buyer
            </Button>
          </Link>
        </div>

        {buyers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <h3 className="text-lg font-medium text-slate-900">Start building your buyer pipeline.</h3>
            <p className="text-slate-500 mt-2 mb-6">Add your first buyer requirement.</p>
            <Link href="/buyers/new">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Add Buyer</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map(b => (
              <Link href={`/buyers/${b.id}`} key={b.id}>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition cursor-pointer group">
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-violet-600 transition mb-4">{b.name}</h3>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    {b.phone && <div className="flex items-center gap-2"><Phone size={14} /> {b.phone}</div>}
                    {b.email && <div className="flex items-center gap-2"><Mail size={14} /> {b.email}</div>}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50">
                    <p className="text-sm font-medium text-slate-900">
                      Budget: {b.minBudget ? `₹${(b.minBudget / 100000).toFixed(1)}L` : 'Any'} - {b.maxBudget ? `₹${(b.maxBudget / 100000).toFixed(1)}L` : 'Any'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Looking for: {b.bedrooms ? `${b.bedrooms} BHK ` : ''}{b.propertyType || 'Any Property'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
