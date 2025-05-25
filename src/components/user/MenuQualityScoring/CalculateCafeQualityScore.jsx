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
export function CalculateCafeItemScore(item) {
    let total = 5;
    let score = 0;
  
    if (item.name) score++;
    if (item.description) score++;
    if (Array.isArray(item.size_options) && item.size_options.length > 0) score++;
    if (Array.isArray(item.dairy_options) && item.dairy_options.length > 0) score++;
    if (Array.isArray(item.tags) && item.tags.length > 0) score++;
  
    return Math.round((score / total) * 100);
  }
  