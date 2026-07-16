export const SEGMENT_COLORS: Record<string, string> = {
  "Comprador Ativo": "#2563EB",
  "Devedor Rotativo": "#EA580C",
  "Usuário de Adiantamento": "#DC2626",
  "Bom Pagador": "#16A34A",
  fallback: "#6B7280",
};

export const DATASET_PAGE_SIZES = [25, 50, 100, 200, 500, 1000] as const;

export const PROTECTED_PATHS = ["/dashboard", "/insights", "/customers", "/dataset", "/settings"];
