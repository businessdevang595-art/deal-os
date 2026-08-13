"use client";

import { useState } from "react";
import { createOffer } from "@/app/actions/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function OfferForm({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await createOffer(dealId, Number(formData.get("amount")), formData.get("notes") as string);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      setError("Failed to create offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
      <h3 className="font-semibold text-sm text-slate-900">Record New Offer</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input type="number" name="amount" placeholder="Amount (₹)" required className="sm:w-1/3" />
        <Input type="text" name="notes" placeholder="Conditions / Notes" className="flex-1" />
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "..." : "Save"}
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
    </form>
  );
}
