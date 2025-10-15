import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = ({
  title,
  columns,
  rows,
  fileName = "data.pdf",
  footerText,
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "A4",
  });

  doc.setFontSize(16);
  doc.text(title, 40, 40);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60);

  // ✅ Correct way
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 80,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [40, 167, 69], textColor: 255 },
  });

  if (footerText) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(footerText, 40, pageHeight - 30);
  }

  doc.save(fileName);
};
