import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../../dashboard/layout";
import { updateDealStage } from "@/app/actions/deal";
import { Button } from "@/components/ui/button";
import OfferForm from "./OfferForm";

const STAGES = ["Qualified", "Matched", "Site Visit", "Offer", "Negotiation", "Closing", "Closed", "Lost"];

export default async function DealRoomPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id: id, userId: session.user.id },
    include: {
      buyer: true,
      property: true,
      offers: { orderBy: { date: 'desc' } }
    }
  });

  if (!deal) redirect("/deals");

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-6xl mx-auto space-y-8">
        <header className="bg-slate-950 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Deal Room</h1>
            <div className="flex items-center gap-2 text-slate-400">
              <span>{deal.buyer.name}</span>
              <span>×</span>
              <span className="text-blue-400">{deal.property.title}</span>
            </div>
          </div>
          
          {/* Pipeline Vis */}
          <div className="mt-12 relative z-10 flex items-center justify-between">
            {STAGES.map((s, i) => {
              const currentIndex = STAGES.indexOf(deal.stage);
              const isActive = i <= currentIndex;
              const isCurrent = i === currentIndex;
              
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative group">
                  {i < STAGES.length - 1 && (
                    <div className={`absolute top-3 left-1/2 w-full h-1 -z-10 ${isActive ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
                  )}
                  <form action={async () => {
                    "use server";
                    await updateDealStage(deal.id, s);
                  }}>
                    <button type="submit" className={`w-6 h-6 rounded-full border-2 transition-all ${isCurrent ? 'bg-blue-500 border-white scale-125' : isActive ? 'bg-blue-600 border-blue-600' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}></button>
                  </form>
                  <span className={`text-xs mt-3 text-center ${isCurrent ? 'text-white font-bold' : isActive ? 'text-slate-300' : 'text-slate-600'}`}>{s}</span>
                </div>
              );
            })}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Offers & Negotiation</h2>
            
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-sm text-slate-500 mb-1">Asking Price</div>
              <div className="text-2xl font-bold text-slate-900">₹{(deal.property.askingPrice / 100000).toFixed(1)}L</div>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {deal.offers.length === 0 ? (
                <div className="text-center text-slate-500 py-8 relative z-10 bg-white">No offers recorded yet.</div>
              ) : (
                deal.offers.map((offer) => (
                  <div key={offer.id} className="relative z-10 bg-white p-4 rounded-xl border border-slate-200 shadow-sm ml-10 md:ml-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-slate-900">₹{(offer.amount / 100000).toFixed(1)}L</span>
                      <span className="text-xs text-slate-500">{new Date(offer.date).toLocaleDateString()}</span>
                    </div>
                    {offer.notes && <p className="text-sm text-slate-600">{offer.notes}</p>}
                  </div>
                ))
              )}
            </div>
            
            <OfferForm dealId={deal.id} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Closing Workspace</h2>
            <div className="space-y-3">
               {[
                 "Buyer information recorded",
                 "Seller information recorded",
                 "Property information verified",
                 "Offer recorded and accepted",
                 "Required documents received",
                 "Agreement status recorded",
                 "Payment status verified",
                 "Registration scheduled",
               ].map((task, i) => (
                 <label key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-100 transition">
                   <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                   <span className="text-sm text-slate-700">{task}</span>
                 </label>
               ))}
               <p className="text-xs text-slate-400 text-center mt-6 pt-4 border-t border-slate-50">Workflow organization only — not legal advice.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
