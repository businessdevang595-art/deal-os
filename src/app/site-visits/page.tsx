import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "../dashboard/layout";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import VisitForm from "./VisitForm";

export default async function SiteVisitsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const visits = await prisma.siteVisit.findMany({
    where: { userId: session.user.id },
    include: {
      buyer: true,
      property: true,
      feedback: true,
    },
    orderBy: { date: "desc" },
  });

  const properties = await prisma.property.findMany({ where: { userId: session.user.id } });
  const buyers = await prisma.buyer.findMany({ where: { userId: session.user.id } });

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Visits</h1>
            <p className="text-slate-500 mt-1">Manage viewings and collect feedback.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <VisitForm properties={properties} buyers={buyers} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {visits.length === 0 ? (
               <div className="bg-white p-10 text-center rounded-2xl border border-slate-100">
                 <p className="text-slate-500">No site visits scheduled.</p>
               </div>
            ) : (
              visits.map(visit => (
                <div key={visit.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       {visit.status === "Completed" ? (
                         <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={14}/> Completed</span>
                       ) : (
                         <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><Clock size={14}/> {visit.status}</span>
                       )}
                       <span className="text-sm font-medium text-slate-500">{new Date(visit.date).toLocaleString()}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900">{visit.property.title}</h3>
                    <p className="text-slate-600">Buyer: {visit.buyer.name}</p>
                    {visit.notes && <p className="text-sm text-slate-500 mt-2 italic">&quot;{visit.notes}&quot;</p>}
                    
                    {visit.feedback && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Feedback</p>
                        <p className="text-sm text-slate-900 font-medium">{visit.feedback.reaction}</p>
                        {visit.feedback.nextAction && <p className="text-sm text-slate-600 mt-1">{visit.feedback.nextAction}</p>}
                      </div>
                    )}
                  </div>
                  
                  {visit.status !== "Completed" && (
                    <form action={async () => {
                      "use server";
                      await prisma.siteVisit.update({
                        where: { id: visit.id, userId: session.user.id },
                        data: { status: "Completed" }
                      });
                    }}>
                      <Button variant="outline" size="sm">Mark Complete</Button>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
