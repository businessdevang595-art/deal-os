import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Bed, Maximize } from "lucide-react";
import DashboardLayout from "../dashboard/layout";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Properties</h1>
            <p className="text-slate-500 mt-1">Manage your inventory</p>
          </div>
          <Link href="/properties/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={18} /> Add Property
            </Button>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <h3 className="text-lg font-medium text-slate-900">Your property inventory starts here.</h3>
            <p className="text-slate-500 mt-2 mb-6">Add your first property to begin matching with buyers.</p>
            <Link href="/properties/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Property</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <Link href={`/properties/${p.id}`} key={p.id}>
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition cursor-pointer group">
                  <div className="h-48 bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition truncate pr-2">{p.title}</h3>
                      <span className="font-bold text-blue-600 whitespace-nowrap">₹{(p.askingPrice / 100000).toFixed(1)}L</span>
                    </div>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mb-4 truncate">
                      <MapPin size={14} /> {p.locality}, {p.city}
                    </p>
                    <div className="flex gap-4 text-slate-600 text-sm border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-1"><Bed size={16} /> {p.bedrooms} BHK</div>
                      <div className="flex items-center gap-1"><Maximize size={16} /> {p.area} sqft</div>
                    </div>
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
