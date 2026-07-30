export const CATEGORIES = [
  "Identity",
  "Education",
  "Finance",
  "Medical",
  "Insurance",
  "Legal",
  "Employment",
  "Others",
] as const;

export type Category = (typeof CATEGORIES)[number];