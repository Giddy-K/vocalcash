'use client'

import { Transaction } from '@/types/transaction'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

type Props = {
  data: Transaction[]
}

export default function SummaryChart({ data }: Props) {
  if (!data.length) return null

  const map = new Map<string, { income: number; expense: number }>()
  data.forEach((tx) => {
    const ym = tx.created_at.slice(0, 7) // YYYY-MM
    if (!map.has(ym)) map.set(ym, { income: 0, expense: 0 })
    map.get(ym)![tx.type] += tx.amount
  })

  const labels = Array.from(map.keys()).sort()
  const incomeSeries = labels.map((l) => map.get(l)!.income)
  const expenseSeries = labels.map((l) => map.get(l)!.expense)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeSeries,
        backgroundColor: '#10B981', // green
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: expenseSeries,
        backgroundColor: '#EF4444', // red
        borderRadius: 4,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        font: { size: 16 },
        color: '#fff',
      },
    },
    responsive: true,
    scales: {
      x: { stacked: false, ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } },
    },
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  )
}
