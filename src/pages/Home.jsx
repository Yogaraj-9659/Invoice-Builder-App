import React, { useEffect, useState, useMemo } from "react";
import html2pdf from "html2pdf.js";
import { FaPlus, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";

export default function App() {
    const [invoice, setInvoice] = useState({
        invoiceNo: "INV-001",
        date: new Date().toISOString().slice(0, 10),
        client: { name: "", address: "", email: "", phone: "" },
        items: [],
        taxPercent: 18,
        currency: "₹",
    });

    useEffect(() => {
        const saved = localStorage.getItem("invoice-draft");
        if (saved) setInvoice(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("invoice-draft", JSON.stringify(invoice));
    }, [invoice]);

    const updateClient = (field, value) =>
        setInvoice((p) => ({ ...p, client: { ...p.client, [field]: value } }));

    const setField = (field, value) => setInvoice((p) => ({ ...p, [field]: value }));

    const addItem = () =>
        setInvoice((p) => ({
            ...p,
            items: [...p.items, { id: Date.now(), description: "", qty: 1, rate: 0 }],
        }));

    const updateItem = (id, changes) =>
        setInvoice((p) => ({
            ...p,
            items: p.items.map((it) => (it.id === id ? { ...it, ...changes } : it)),
        }));

    const removeItem = (id) =>
        setInvoice((p) => ({ ...p, items: p.items.filter((it) => it.id !== id) }));

    const totals = useMemo(() => {
        const subTotal = invoice.items.reduce(
            (s, it) => s + (Number(it.qty || 0) * Number(it.rate || 0)),
            0
        );
        const taxAmount = (subTotal * Number(invoice.taxPercent || 0)) / 100;
        const grandTotal = subTotal + taxAmount;
        return { subTotal, taxAmount, grandTotal };
    }, [invoice.items, invoice.taxPercent]);

    const exportPDF = () => {
        const element = document.getElementById("invoice-preview");
        if (!element) return alert("Preview not found");

        const opt = {
            margin: 0.4,
            filename: `${invoice.invoiceNo || "invoice"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().set(opt).from(element).save();
    };

    const printInvoice = () => {
        const printContents = document.getElementById("invoice-preview").innerHTML;
        const w = window.open("", "_blank", "width=900,height=700");
        w.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>`);
        w.document.close();
        w.focus();
        setTimeout(() => {
            w.print();
            w.close();
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 text-gray-100">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-black-800 drop-shadow-sm">
                    Invoice Builder</h1>
                <div className="grid md:grid-cols-2 gap-6">

                    <div className="space-y-5">

                        <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200">
                            <h2 className="font-semibold text-lg mb-3 text-black">Client & Invoice Details</h2>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <input
                                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-black placeholder-black"
                                        placeholder="Client name"
                                        value={invoice.client.name}
                                        onChange={(e) => updateClient("name", e.target.value)}
                                    />

                                    <input
                                        className="w-40 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-black placeholder-black"
                                        value={invoice.invoiceNo}
                                        onChange={(e) => setField("invoiceNo", e.target.value)}
                                        placeholder="Invoice #"
                                    />
                                </div>
                                <input
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-black placeholder-black"
                                    placeholder="Client address"
                                    value={invoice.client.address}
                                    onChange={(e) => updateClient("address", e.target.value)}
                                />
                                <div className="flex gap-3">
                                    <input
                                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-black placeholder-black"
                                        placeholder="Email"
                                        value={invoice.client.email}
                                        onChange={(e) => updateClient("email", e.target.value)}
                                    />
                                    <input
                                        className="w-40 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white text-black placeholder-black"
                                        type="date"
                                        value={invoice.date}
                                        onChange={(e) => setField("date", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-semibold text-lg text-black">Items</h2>
                                <button onClick={addItem} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow">
                                    <FaPlus /> Add Item
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="text-left border-b bg-gray-100">
                                            <th className="py-2 px-2 text-blue-600">Description</th>
                                            <th className="py-2 px-2 w-20 text-blue-600">Qty</th>
                                            <th className="py-2 px-2 w-28 text-blue-600">Rate</th>
                                            <th className="py-2 px-2 w-28 text-blue-600">Amount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-red-500">No items yet</td>
                                            </tr>
                                        )}
                                        {invoice.items.map((it) => {
                                            const amount = (Number(it.qty || 0) * Number(it.rate || 0)) || 0;
                                            return (
                                                <tr key={it.id} className="border-b">
                                                    <td className="py-2 px-2">
                                                        <input
                                                            className="w-full border rounded-lg px-2 py-1 bg-white text-black placeholder-black focus:ring-2 focus:ring-blue-300 outline-none"
                                                            value={it.description}
                                                            onChange={(e) => updateItem(it.id, { description: e.target.value })}
                                                            placeholder="Item description"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="number"
                                                            className="w-full border rounded-lg px-2 py-1 bg-white text-black placeholder-black focus:ring-2 focus:ring-blue-300 outline-none"
                                                            value={it.qty}
                                                            onChange={(e) => updateItem(it.id, { qty: parseInt(e.target.value || 0, 10) })}
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="number"
                                                            className="w-full border rounded-lg px-2 py-1 bg-white text-black placeholder-black focus:ring-2 focus:ring-blue-300 outline-none"
                                                            value={it.rate}
                                                            onChange={(e) => updateItem(it.id, { rate: parseFloat(e.target.value || 0) })}
                                                            step="1"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-2 text-black">{invoice.currency} {amount.toFixed(2)}</td>
                                                    <td className="py-2 px-2 text-center">
                                                        <button onClick={() => removeItem(it.id)} className="text-red-500 hover:text-red-700 transition">
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="font-semibold text-lg mb-3 text-black">Totals</h3>
                            <div className="flex justify-between mb-2 text-black">
                                <span>Subtotal</span>
                                <span>{invoice.currency} {totals.subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <label className="text-sm text-gray-600">Tax %</label>
                                <input
                                    type="number"
                                    className="w-20 border rounded-lg px-2 py-1 bg-white text-black placeholder-black focus:ring-2 focus:ring-blue-300 outline-none"
                                    value={invoice.taxPercent}
                                    onChange={(e) => setField("taxPercent", Number(e.target.value || 0))}
                                />
                                <div className="ml-auto font-medium text-black">{invoice.currency} {totals.taxAmount.toFixed(2)}</div>
                            </div>
                            <div className="flex justify-between font-bold text-xl mt-3 text-gray-800">
                                <span>Total</span>
                                <span>{invoice.currency} {totals.grandTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={exportPDF}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition">
                                <FaFilePdf /> Export PDF
                            </button>

                            <button
                                type="button"
                                onClick={printInvoice}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow transition">
                                <FaPrint /> Print
                            </button>
                        </div>
                    </div>

                    <div>
                        <div
                            id="invoice-preview"
                            className="bg-white p-6 rounded-xl shadow-xl max-w-[800px] mx-auto border border-gray-200"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-700">My Shop</h2>
                                    <div className="text-sm text-gray-600">Villapuram Bus stop<br />Madurai, Tamilnadu</div>
                                </div>
                                <div className="text-right text-black">
                                    <div>Invoice #: <strong>{invoice.invoiceNo}</strong></div>
                                    <div>Date: <strong>{invoice.date}</strong></div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-medium text-black mb-1">Bill To:</h3>
                                <div className="text-black">{invoice.client.name || "-"}</div>
                                <div className="text-sm text-black">{invoice.client.address || "-"}</div>
                                <div className="text-sm text-black">{invoice.client.email} {invoice.client.phone && `• ${invoice.client.phone}`}</div>
                            </div>

                            <table className="w-full mb-4">
                                <thead>
                                    <tr className="text-left border-b bg-gray-100">
                                        <th className="py-2 text-blue-600">Description</th>
                                        <th className="py-2 w-20 text-blue-600">Qty</th>
                                        <th className="py-2 w-28 text-blue-600">Rate</th>
                                        <th className="py-2 w-28 text-blue-600">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((it) => {
                                        const amount = (Number(it.qty || 0) * Number(it.rate || 0)) || 0;
                                        return (
                                            <tr key={it.id} className="border-b">
                                                <td className="py-2 text-black">{it.description || "-"}</td>
                                                <td className="py-2 text-black">{it.qty}</td>
                                                <td className="py-2 text-black">{invoice.currency} {Number(it.rate || 0).toFixed(2)}</td>
                                                <td className="py-2 text-black">{invoice.currency} {amount.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="flex justify-end flex-col space-y-1">
                                <div className="flex justify-between w-64 text-black">
                                    <span>Subtotal:</span>
                                    <span>{invoice.currency} {totals.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 text-black">
                                    <span>Tax ({invoice.taxPercent}%):</span>
                                    <span>{invoice.currency} {totals.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-lg mt-2 text-gray-800">
                                    <span>Total:</span>
                                    <span>{invoice.currency} {totals.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 text-sm text-gray-600">
                                <div>Notes:</div>
                                <div>Thank you for your business!</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
