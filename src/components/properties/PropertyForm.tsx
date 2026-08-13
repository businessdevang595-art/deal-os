"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/app/actions/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PropertyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createProperty(formData);
      if (result.success) {
        router.push("/properties");
      }
    } catch (err: unknown) {
      setError("Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Property Title</label>
          <Input name="title" required placeholder="Luxury 3BHK in Civil Lines" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Property Type</label>
          <Input name="propertyType" required placeholder="Apartment" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Address</label>
          <Input name="address" required placeholder="123 Main St" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Locality</label>
          <Input name="locality" required placeholder="Civil Lines" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">City</label>
          <Input name="city" required placeholder="Mumbai" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">State</label>
          <Input name="state" required placeholder="Maharashtra" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Pincode</label>
          <Input name="pincode" required placeholder="400001" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Bedrooms</label>
          <Input name="bedrooms" type="number" required placeholder="3" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Bathrooms</label>
          <Input name="bathrooms" type="number" required placeholder="2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Area (sq.ft.)</label>
          <Input name="area" type="number" required placeholder="1850" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Asking Price (₹)</label>
          <Input name="askingPrice" type="number" required placeholder="8200000" />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea 
            name="description" 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Property description..."
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 text-center">
            Note: Image upload functionality is restricted in this environment due to the lack of external cloud storage credentials (AWS S3, Supabase Storage, etc). The system currently defaults to placeholder galleries.
          </div>
        </div>
      </div>
      
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Saving..." : "Save Property"}
        </Button>
      </div>
    </form>
  );
}
