/**
 * Vitamin K Color Palette and Utilities
 *
 * 4 shades of green representing vitamin K intake levels
 * from very light (low) to dark green (extra high)
 */

export const VITAMIN_K_COLORS = {
  Low: {
    light: '#86efac',  // green-300 - Very light green
    dark: '#4ade80',   // green-400
  },
  Medium: {
    light: '#4ade80',  // green-400 - Mid green
    dark: '#22c55e',   // green-500
  },
  High: {
    light: '#22c55e',  // green-500 - Green
    dark: '#16a34a',   // green-600
  },
  ExtraHigh: {
    light: '#16a34a',  // green-600 - Dark green
    dark: '#15803d',   // green-700
  },
} as const;

export const VITAMIN_K_FOOD_EXAMPLES = {
  Low: 'Apples, Bananas, Carrots (small amounts)',
  Medium: 'Broccoli (moderate), Asparagus, Green beans',
  High: 'Kale, Spinach, Swiss chard (1 serving)',
  ExtraHigh: 'Large serving of leafy greens, Liver, Multiple high-K foods',
} as const;

/**
 * Get the appropriate color for a vitamin K category
 * @param category - Vitamin K category (Low, Medium, High, ExtraHigh) or null
 * @param theme - Color theme (light or dark mode)
 * @returns Hex color code
 */
export function getVitaminKColor(
  category: string | null | undefined,
  theme: 'light' | 'dark' = 'light'
): string {
  if (!category) {
    return theme === 'light' ? '#d1d5db' : '#6b7280'; // gray-300 / gray-500
  }

  const normalizedCategory = category as keyof typeof VITAMIN_K_COLORS;

  if (VITAMIN_K_COLORS[normalizedCategory]) {
    return VITAMIN_K_COLORS[normalizedCategory][theme];
  }

  // Default to gray for unknown categories
  return theme === 'light' ? '#d1d5db' : '#6b7280';
}

/**
 * Get food examples for a vitamin K category
 * @param category - Vitamin K category
 * @returns Food examples string
 */
export function getVitaminKFoodExamples(category: string | null | undefined): string {
  if (!category) return 'None tracked';

  const normalizedCategory = category as keyof typeof VITAMIN_K_FOOD_EXAMPLES;

  return VITAMIN_K_FOOD_EXAMPLES[normalizedCategory] || 'Unknown category';
}

/**
 * Get the display label for a vitamin K category
 * @param category - Vitamin K category
 * @returns Formatted display label
 */
export function getVitaminKLabel(category: string | null | undefined): string {
  if (!category) return 'None';
  if (category === 'ExtraHigh') return 'Extra High';
  return category;
}
