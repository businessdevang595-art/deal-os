// Simulated AI Extraction for Demo Purposes

export function extractPropertyDetails(text: string) {
  // Use simple regex heuristics to pull data out of unstructured text
  const priceRegex = /(?:rs|inr|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|l|crore|cr)?/i;
  const bedRegex = /(\d+)\s*(?:bhk|bedroom|bed)/i;
  
  const priceMatch = text.match(priceRegex);
  const bedMatch = text.match(bedRegex);
  
  let askingPrice = 0;
  if (priceMatch) {
    const rawNum = parseFloat(priceMatch[1].replace(/,/g, ''));
    const multiplierStr = priceMatch[2]?.toLowerCase();
    let multiplier = 1;
    if (['lakh', 'l'].includes(multiplierStr)) multiplier = 100000;
    if (['crore', 'cr'].includes(multiplierStr)) multiplier = 10000000;
    askingPrice = rawNum * multiplier;
  }

  return {
    askingPrice,
    bedrooms: bedMatch ? parseInt(bedMatch[1]) : undefined,
    originalText: text
  };
}
