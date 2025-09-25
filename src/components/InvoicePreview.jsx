export default function InvoicePreview({ invoice }) {
    const subTotal = invoice.items.reduce(
        (sum, i) => sum + i.qty * i.rate,
        0
    );
    const taxAmount = (subTotal * invoice.taxPercent) / 100;
    const grandTotal = subTotal + taxAmount;

    return (
        <div
            id="invoice-preview"
            className="bg-white p-6 rounded-lg shadow-xl border border-gray-200"
        >
            <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
            <p>Invoice No: {invoice.invoiceNo}</p>
            <p>Date: {invoice.date}</p>
            <p>Client: {invoice.client.name}</p>

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Description</th>
                        <th className="border px-2 py-1">Qty</th>
                        <th className="border px-2 py-1">Rate</th>
                        <th className="border px-2 py-1">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((it) => (
                        <tr key={it.id}>
                            <td className="border px-2 py-1">{it.description}</td>
                            <td className="border px-2 py-1">{it.qty}</td>
                            <td className="border px-2 py-1">{invoice.currency}{it.rate}</td>
                            <td className="border px-2 py-1">{invoice.currency}{it.qty * it.rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <p>Subtotal: {invoice.currency}{subTotal}</p>
                <p>Tax ({invoice.taxPercent}%): {invoice.currency}{taxAmount}</p>
                <p className="font-bold">Total: {invoice.currency}{grandTotal}</p>
            </div>
        </div>
    );
}
