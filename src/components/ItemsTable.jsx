import React from "react";

export default function ItemsTable({ items, addItem, updateItem, removeItem, currency }) {
    const onChange = (id, field, value) => {
        if (field === "qty" || field === "rate") {
            const parsed = field === "qty" ? parseInt(value || 0, 10) : parseFloat(value || 0);
            updateItem(id, { [field]: parsed });
        } else {
            updateItem(id, { [field]: value });
        }
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
                <h2 className="font-medium">Items</h2>
                <button onClick={addItem} className="bg-blue-600 text-white px-3 py-1 rounded">Add Item</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-2">Description</th>
                            <th className="pb-2 w-20">Qty</th>
                            <th className="pb-2 w-28">Rate</th>
                            <th className="pb-2 w-28">Amount</th>
                            <th className="pb-2 w-20"> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">No items yet</td>
                            </tr>
                        )}
                        {items.map((it) => {
                            const amount = (Number(it.qty || 0) * Number(it.rate || 0)) || 0;
                            return (
                                <tr key={it.id} className="align-top">
                                    <td className="py-2">
                                        <input
                                            className="w-full border rounded px-2 py-1"
                                            value={it.description}
                                            onChange={(e) => onChange(it.id, "description", e.target.value)}
                                            placeholder="Item description"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input
                                            type="number"
                                            className="w-full border rounded px-2 py-1"
                                            value={it.qty}
                                            onChange={(e) => onChange(it.id, "qty", e.target.value)}
                                            min="0"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input
                                            type="number"
                                            className="w-full border rounded px-2 py-1"
                                            value={it.rate}
                                            onChange={(e) => onChange(it.id, "rate", e.target.value)}
                                            step="0.01"
                                            min="0"
                                        />
                                    </td>
                                    <td className="py-2">{currency} {amount.toFixed(2)}</td>
                                    <td className="py-2">
                                        <button onClick={() => removeItem(it.id)} className="text-red-500">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
