"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDeal } from "@/app/actions/deal"
import { Button } from "@/components/ui/button"

export function DealForm({
  buyers,
  properties,
  defaultBuyerId,
  defaultPropertyId,
}: {
  buyers: { id: string; name: string }[]
  properties: { id: string; title: string; locality: string | null }[]
  defaultBuyerId?: string
  defaultPropertyId?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [buyerId, setBuyerId] = useState(defaultBuyerId || "")
  const [propertyId, setPropertyId] = useState(defaultPropertyId || "")
  const [amount, setAmount] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!buyerId || !propertyId) {
        throw new Error("Please select both a buyer and a property")
      }

      await createDeal(buyerId, propertyId)
      router.push("/deals")
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Buyer</label>
        <select
          value={buyerId}
          onChange={(e) => setBuyerId(e.target.value)}
          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          required
        >
          <option value="">Select a buyer</option>
          {buyers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Property</label>
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          required
        >
          <option value="">Select a property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} - {p.locality}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Initial Amount (Optional)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="e.g. 7500000"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white hover:bg-slate-800"
      >
        {loading ? "Creating..." : "Create Deal"}
      </Button>
    </form>
  )
}