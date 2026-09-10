/**
 * Utility để xuất dữ liệu bảng ra file CSV hỗ trợ tiếng Việt có dấu (UTF-8 BOM)
 * Tương thích hoàn hảo với Microsoft Excel, Google Sheets, LibreOffice
 */

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | boolean | null | undefined);
}

export function exportToCsv<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string = "export"
) {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để xuất file.");
    return;
  }

  // 1. Tạo hàng tiêu đề (Headers)
  const headers = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(",");

  // 2. Tạo các hàng dữ liệu (Rows)
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let val: unknown;
        if (typeof col.accessor === "function") {
          val = col.accessor(item);
        } else {
          val = item[col.accessor];
        }

        const strVal = val === null || val === undefined ? "" : String(val);

        // Thoát dấu nháy kép bên trong
        return `"${strVal.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  // 3. Ghép nội dung và thêm ký tự UTF-8 BOM (\uFEFF) để Excel hiển thị đúng tiếng Việt
  const csvContent = "\uFEFF" + [headers, ...rows].join("\r\n");

  // 4. Tạo Blob và tải file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${timestamp}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
