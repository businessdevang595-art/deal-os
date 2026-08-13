import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Home, Users, Calendar, Briefcase } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [activeProperties, activeBuyers, activeDeals, upcomingVisits] = await Promise.all([
    prisma.property.count({ where: { userId } }),
    prisma.buyer.count({ where: { userId } }),
    prisma.deal.count({ where: { userId, stage: { notIn: ["Closed", "Lost"] } } }),
    prisma.siteVisit.count({ where: { userId, status: "Scheduled" } })
  ]);

  return (
    <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user.name}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500">Active Properties</p>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Home size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeProperties}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500">Active Buyers</p>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg"><Users size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeBuyers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500">Active Deals</p>
            <div className="p-2 bg-coral-50 text-coral-600 rounded-lg"><Briefcase size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeDeals}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-500">Upcoming Visits</p>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Calendar size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{upcomingVisits}</p>
        </div>
      </div>

      {/* Placeholder for activity feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
