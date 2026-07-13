export const THEME_COLORS = ["yellow", "green", "blue", "red"] as const;
export type ThemeColor = (typeof THEME_COLORS)[number];

// nomi "veri" del design mostrati in admin (le key DB restano yellow/green/blue/red)
export const THEME_COLOR_LABELS: Record<ThemeColor, string> = {
  yellow: "Lemon",
  green: "Mint",
  blue: "Purple",
  red: "Hot pink",
};

export const BG: Record<ThemeColor, string> = {
  yellow: "bg-yellow",
  green: "bg-green",
  blue: "bg-blue",
  red: "bg-red",
};
