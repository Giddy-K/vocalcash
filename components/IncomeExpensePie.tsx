'use client'

import { Transaction } from '@/types/transaction'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  data: Transaction[]
}

export default function IncomeExpensePie({ data }: Props) {
  if (!data.length) return null

  const income = data
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const expense = data
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'KES',
        data: [income, expense],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <Pie data={chartData} />
    </div>
  )
}
