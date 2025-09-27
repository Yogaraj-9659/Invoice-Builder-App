import React from "react";
import { jsPDF } from "jspdf";

export default function TotalsPannel() {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Hello, this is a test PDF", 20, 20);
    doc.save("test.pdf");
  };

  return (
    <div className="p-10">
      <button
        onClick={exportPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Export PDF
      </button>
    </div>
  );
}
