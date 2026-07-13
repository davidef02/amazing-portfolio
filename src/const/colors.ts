export const THEME_COLORS = ["yellow", "green", "blue", "red"] as const;
export type ThemeColor = (typeof THEME_COLORS)[number];

export const BG: Record<ThemeColor, string> = {
  yellow: "bg-yellow",
  green: "bg-green",
  blue: "bg-blue",
  red: "bg-red",
};
