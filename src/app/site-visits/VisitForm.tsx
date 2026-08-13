"use client";

import { useState } from "react";
import { scheduleVisit } from "@/app/actions/visit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function VisitForm({ properties, buyers }: { properties: {id: string, title: string}[], buyers: {id: string, name: string}[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const result = await scheduleVisit(formData);
      if (result.error) {
         setError(result.error);
         return;
      }
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setError("Failed to schedule visit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Schedule Visit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Buyer</label>
          <select name="buyerId" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">Select Buyer...</option>
            {buyers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Property</label>
          <select name="propertyId" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
            <option value="">Select Property...</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <Input type="date" name="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
            <Input type="time" name="time" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <Input type="text" name="notes" placeholder="e.g. Bring keys for #101" />
        </div>
        
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Scheduling..." : "Schedule Visit"}
        </Button>
      </form>
    </div>
  );
}
