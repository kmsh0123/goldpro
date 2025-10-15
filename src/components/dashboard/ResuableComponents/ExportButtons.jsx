import { CSVExportLink } from "@/lib/exportToCSV";
import React from "react";

export default function ExportButtons({
  csvConfig,
  onPdfExport,
  excelIcon = "/images/excel-icon.png",
  pdfIcon = "/images/pdf-icon.png",
}) {
  return (
    <div className="flex items-center gap-4 cursor-pointer">
      {/* CSV Export */}
      <CSVExportLink config={csvConfig}>
        <img
          src={excelIcon}
          alt="export-csv"
          width={25}
          className="hover:opacity-80 transition"
        />
      </CSVExportLink>

      {/* PDF Export */}
      <img
        src={pdfIcon}
        alt="export-pdf"
        width={25}
        onClick={onPdfExport}
        className="hover:opacity-80 transition"
      />
    </div>
  );
}
