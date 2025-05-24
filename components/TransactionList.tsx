'use client'

import { Transaction } from '@/types/transaction'

type Props = {
  data: Transaction[]
}

export default function TransactionList({ data }: Props) {
  if (!data.length) return <p>No transactions yet.</p>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Category</th>
            <th className="px-3 py-2 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx) => (
            <tr key={tx.id} className="border-t">
              <td className="px-3 py-1">
                {tx.created_at.slice(0, 10)}
              </td>
              <td className="px-3 py-1 capitalize">{tx.type}</td>
              <td className="px-3 py-1">
                {tx.amount.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'KES',
                  minimumFractionDigits: 0,
                })}
              </td>
              <td className="px-3 py-1">{tx.category ?? '-'}</td>
              <td className="px-3 py-1">{tx.note ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
