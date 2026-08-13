import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "../../dashboard/layout";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const property = await prisma.property.findUnique({
    where: { id: (await params).id, userId: session.user.id },
  });

  if (!property) redirect("/properties");

  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{property.title}</h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <MapPin size={16} /> {property.locality}, {property.city}, {property.state} {property.pincode}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">₹{(property.askingPrice / 100000).toFixed(1)}L</div>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block mt-2">Active</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Image Placeholder */}
            <div className="w-full h-80 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
              Gallery Coming Soon
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{property.description || "No description provided."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-500 flex items-center gap-2"><Bed size={16} /> Bedrooms</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-500 flex items-center gap-2"><Bath size={16} /> Bathrooms</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-500 flex items-center gap-2"><Maximize size={16} /> Area</span>
                  <span className="font-medium">{property.area} sq.ft.</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
