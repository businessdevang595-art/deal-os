import PropertyForm from "@/components/properties/PropertyForm";
import DashboardLayout from "../../dashboard/layout";

export default function NewPropertyPage() {
  return (
    <DashboardLayout>
      <div className="p-8 pb-24 md:pb-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Property</h1>
          <p className="text-slate-500 mt-1">Enter property details into the system.</p>
        </div>
        <PropertyForm />
      </div>
    </DashboardLayout>
  );
}
