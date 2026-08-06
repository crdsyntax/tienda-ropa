import * as XLSX from 'xlsx';

export interface ExcelColumn {
  header: string;
  key: string;
}

export function exportRowsToExcel<T extends Record<string, unknown>>(
  columns: ExcelColumn[],
  rows: T[],
  sheetName: string,
  fileName: string,
): void {
  const header = columns.map((c) => c.header);
  const data = rows.map((row) => columns.map((c) => row[c.key] ?? ''));
  const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
  ws['!cols'] = columns.map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}