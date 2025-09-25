import React, { useMemo } from "react";

export default function TotalsPanel({ items, taxPercent, setTax, currency }) {
    const { subTotal, taxAmount, grandTotal } = useMemo(() => {
        const sub = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.rate || 0)), 0);
        const tax = (sub * Number(taxPercent || 0)) / 100;
        return { subTotal: sub, taxAmount: tax, grandTotal: sub + tax };
    }, [items, taxPercent]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">Totals</h3>

            <div className="flex justify-between mb-1">
                <span>Subtotal</span>
                <span>{currency} {subTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-3 mb-1">
                <label className="text-sm">Tax %</label>
                <input
                    type="number"
                    className="w-20 border rounded px-2 py-1"
                    value={taxPercent}
                    onChange={(e) => setTax(Number(e.target.value || 0))}
                />
                <div className="ml-auto">{currency} {taxAmount.toFixed(2)}</div>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-2">
                <span>Total</span>
                <span>{currency} {grandTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}
