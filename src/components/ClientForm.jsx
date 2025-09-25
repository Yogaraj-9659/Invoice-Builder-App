import React from "react";

export default function ClientForm({ invoice, updateClient, setField }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-medium mb-2">Client & Invoice Details</h2>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Client name"
                        value={invoice.client.name}
                        onChange={(e) => updateClient("name", e.target.value)}
                    />
                    <input
                        className="w-36 border rounded px-2 py-1"
                        value={invoice.invoiceNo}
                        onChange={(e) => setField("invoiceNo", e.target.value)}
                        placeholder="Invoice #"
                    />
                </div>

                <input
                    className="w-full border rounded px-2 py-1"
                    placeholder="Client address"
                    value={invoice.client.address}
                    onChange={(e) => updateClient("address", e.target.value)}
                />

                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Email"
                        value={invoice.client.email}
                        onChange={(e) => updateClient("email", e.target.value)}
                    />
                    <input
                        className="w-36 border rounded px-2 py-1"
                        type="date"
                        value={invoice.date}
                        onChange={(e) => setField("date", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
