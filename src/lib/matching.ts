import { Property, Buyer } from "@prisma/client";

export function calculateMatch(buyer: Buyer, property: Property) {
  let score = 100;
  const reasons = [];

  // Budget Check (30%)
  if (buyer.minBudget && buyer.maxBudget) {
    if (property.askingPrice >= buyer.minBudget && property.askingPrice <= buyer.maxBudget) {
      reasons.push("✓ Within budget");
    } else {
      score -= 30;
      reasons.push("✗ Outside budget");
    }
  }

  // Type Check (15%)
  if (buyer.propertyType) {
    if (buyer.propertyType.toLowerCase() === property.propertyType.toLowerCase()) {
      reasons.push("✓ Matches property type");
    } else {
      score -= 15;
      reasons.push("✗ Different property type");
    }
  }

  // Bedrooms (10%)
  if (buyer.bedrooms) {
    if (buyer.bedrooms === property.bedrooms) {
      reasons.push("✓ Bedroom requirement met");
    } else {
      score -= 10;
      reasons.push("⚠ Bedroom count differs");
    }
  }

  // Area (10%)
  if (buyer.minArea && buyer.maxArea) {
    if (property.area >= buyer.minArea && property.area <= buyer.maxArea) {
      reasons.push("✓ Area within preference");
    } else {
      score -= 10;
      reasons.push("⚠ Area slightly outside preferred range");
    }
  }

  return {
    score: Math.max(0, score),
    reasons
  };
}
