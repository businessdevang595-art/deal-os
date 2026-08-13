"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBuyer } from "@/app/actions/buyer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BuyerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createBuyer(formData);
      if (result.success) {
        router.push("/buyers");
      }
    } catch (err: unknown) {
      setError("Failed to create buyer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Name</label>
          <Input name="name" required placeholder="Rahul Sharma" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <Input name="phone" placeholder="+91 98765 43210" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input name="email" type="email" placeholder="rahul@example.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Min Budget (₹)</label>
          <Input name="minBudget" type="number" placeholder="7500000" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Max Budget (₹)</label>
          <Input name="maxBudget" type="number" placeholder="8500000" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Property Type</label>
          <Input name="propertyType" placeholder="Apartment" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Bedrooms</label>
          <Input name="bedrooms" type="number" placeholder="3" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Notes & Requirements</label>
          <textarea 
            name="notes" 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Looking for a property near the metro..."
          />
        </div>
      </div>
      
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700 text-white">
          {loading ? "Saving..." : "Save Buyer"}
        </Button>
      </div>
    </form>
  );
}
