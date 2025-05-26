// CalculateRestaurantQualityScore.jsx

/**
 * Calculates a quality score for restaurant-style menu items.
 * Total score out of 5 points:
 * - name (1)
 * - description (1)
 * - category (1)
 * - price (1)
 * - tags (1)
 */
export function CalculateRestaurantItemScore(item) {
    let total = 5;
    let score = 0;
  
    if (item.name) score++;
    if (item.description) score++;
    if (item.category) score++;
    if (typeof item.price === "number" && item.price > 0) score++;
    if (Array.isArray(item.tags) && item.tags.length > 0) score++;
  
    return Math.round((score / total) * 100);
  }
  