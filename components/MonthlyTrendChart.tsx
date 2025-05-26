'use client'

import { Transaction } from '@/types/transaction'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type Props = {
  data: Transaction[]
}

export default function MonthlyTrendChart({ data }: Props) {
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
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Expense',
        data: expenseSeries,
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.3,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      title: {
        display: true,
        text: 'Monthly Income & Expense Trends',
        font: { size: 16 },
        color: '#fff',
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } },
    },
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Line data={chartData} options={options} />
    </div>
  )
}
