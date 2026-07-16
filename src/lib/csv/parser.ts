import Papa from "papaparse";

export function parseCsv<T>(content: string): T[] {
  const parsed = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
    delimiter: ",",
  });

  const blockingErrors = parsed.errors.filter((error) => error.type !== "Delimiter");
  if (blockingErrors.length > 0) {
    throw new Error(blockingErrors[0]?.message ?? "Erro ao parsear CSV");
  }

  return parsed.data;
}
