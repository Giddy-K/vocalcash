'use client'

import { Transaction } from '@/types/transaction'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale)

type Props = {
  data: Transaction[]
}

export default function SummaryChart({ data }: Props) {
  if (!data.length) return null

  // group by YYYY-MM
  const map = new Map<string, { income: number; expense: number }>()
  data.forEach((tx) => {
    const ym = tx.created_at.slice(0, 7) // "2025-05"
    if (!map.has(ym)) map.set(ym, { income: 0, expense: 0 })
    map.get(ym)![tx.type] += tx.amount
  })

  const labels = Array.from(map.keys()).sort()
  const incomeSeries = labels.map((l) => map.get(l)!.income)
  const expenseSeries = labels.map((l) => map.get(l)!.expense)

  return (
    <div className="max-w-2xl">
      <Bar
        data={{
          labels,
          datasets: [
            { label: 'Income', data: incomeSeries },
            { label: 'Expense', data: expenseSeries },
          ],
        }}
        options={{
          plugins: { legend: { position: 'top' } },
          responsive: true,
        }}
      />
    </div>
  )
}
