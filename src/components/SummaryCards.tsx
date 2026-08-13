import { useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import type { Transaction } from '../types'
import { formatCurrency, formatMonthYear, getMonthKey } from '../utils'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
  const currentMonth = getMonthKey(new Date())

  const { totalExpense, totalIncome, balance } = useMemo(() => {
    const monthTx = transactions.filter((tx) => tx.date.startsWith(currentMonth))
    const totalExpense = monthTx
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const totalIncome = monthTx
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
    return { totalExpense, totalIncome, balance: totalIncome - totalExpense }
  }, [transactions, currentMonth])

  const monthLabel = formatMonthYear(new Date())

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-500">Tổng quan — {monthLabel}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card flex items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <ArrowUpRight size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chi tiêu</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        <div className="card flex items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <ArrowDownLeft size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Thu nhập</p>
            <p className="text-lg font-bold text-primary-600">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="card flex items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Wallet size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Còn lại</p>
            <p
              className={`text-lg font-bold ${
                balance >= 0 ? 'text-gray-900' : 'text-red-600'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
