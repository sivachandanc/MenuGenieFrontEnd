/**
 * Calculates the quality score for cafe-style menu items.
 * Each item can earn up to 6 points based on:
 * - name (1)
 * - description (1)
 * - category (1)
 * - size_options with at least one valid price (1)
 * - form_options (0.5)
 * - dairy_options (0.5)
 * - tags (1)
 *
 * @param {Array<Object>} items - List of menu items
 * @returns {number} - Score between 0 and 100
 */
export function calculateCafeQualityScore(items) {
    if (!Array.isArray(items) || items.length === 0) return 0;
  
    let total = 0;
    const maxScorePerItem = 6;
  
    for (const item of items) {
      if (item.name) total += 1;
      if (item.description) total += 1;
      if (item.category) total += 1;
  
      if (
        Array.isArray(item.size_options) &&
        item.size_options.some((s) => s.size && s.price)
      ) {
        total += 1;
      }
  
      if (Array.isArray(item.form_options) && item.form_options.length > 0) {
        total += 0.5;
      }
  
      if (Array.isArray(item.dairy_options) && item.dairy_options.length > 0) {
        total += 0.5;
      }
  
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        total += 1;
      }
    }
  
    return Math.round((total / (items.length * maxScorePerItem)) * 100);
  }
  