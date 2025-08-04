function downloadPDF() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (expenses.length === 0) {
    alert("Henüz harcama verisi yok.");
    return;
  }

  let pdfContent = `AYKUT COŞAR - FİNANS TAKİP PDF RAPORU\n\n`;

  expenses.forEach((e, i) => {
    pdfContent += `${i + 1}) ${e.date} - ${e.category} - ${e.note} - ${e.amount} ₺\n`;
  });

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "finans_raporu.pdf";
  link.click();

  URL.revokeObjectURL(url);
}

function downloadExcel() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  if (expenses.length === 0) {
    alert("Henüz harcama verisi yok.");
    return;
  }

  let csvContent = "Tarih,Kategori,Açıklama,Tutar (₺)\n";

  expenses.forEach((e) => {
    csvContent += `${e.date},${e.category},${e.note},${e.amount}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "finans_raporu.csv";
  link.click();

  URL.revokeObjectURL(url);
}