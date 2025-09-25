import html2pdf from "html2pdf.js";

export default function ExportButtons({ invoice }) {
    const handleDownload = () => {
        const element = document.getElementById("invoice-preview");

        if (!element) {
            console.error("Invoice preview element not found!");
            return;
        }

        const opt = {
            margin: 0.4,
            filename: `${invoice.invoiceNo || "invoice"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Download PDF
            </button>
        </div>
    );
}
