import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ArrowDownLeft, ArrowUpRight, LayoutDashboard, Wallet } from 'lucide-react'
import type { Transaction, TransactionType } from '../types'
import { getCategoryById } from '../types'
import { formatCurrency, formatMonthYear, getMonthKey } from '../utils'

interface OverviewProps {
  transactions: Transaction[]
}

interface ChartItem {
  name: string
  value: number
  color: string
  percent: number
}

function groupByCategory(
  transactions: Transaction[],
  type: TransactionType,
  monthKey: string
): { items: ChartItem[]; total: number } {
  const filtered = transactions.filter(
    (tx) => tx.type === type && tx.date.startsWith(monthKey)
  )
  const total = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  if (total === 0) return { items: [], total: 0 }

  const grouped = new Map<string, number>()
  for (const tx of filtered) {
    grouped.set(tx.categoryId, (grouped.get(tx.categoryId) ?? 0) + tx.amount)
  }

  const items = Array.from(grouped.entries())
    .map(([categoryId, value]) => {
      const category = getCategoryById(categoryId)
      return {
        name: category?.name ?? 'Khác',
        value,
        color: category?.color ?? '#6b7280',
        percent: Math.round((value / total) * 1000) / 10,
      }
    })
    .sort((a, b) => b.value - a.value)

  return { items, total }
}

function CategoryBreakdown({
  title,
  items,
  total,
  emptyMessage,
  amountColor,
}: {
  title: string
  items: ChartItem[]
  total: number
  emptyMessage: string
  amountColor: string
}) {
  if (items.length === 0) {
    return (
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-sm text-gray-400 text-center py-8">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <span className={`text-sm font-bold ${amountColor}`}>
          {formatCurrency(total)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-[140px] h-[140px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {items.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2.5">
          {items.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="font-semibold text-gray-900">{item.percent}%</span>
                  <span className="text-gray-400 w-20 text-right">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Overview({ transactions }: OverviewProps) {
  const currentMonth = getMonthKey(new Date())
  const monthLabel = formatMonthYear(new Date())

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

  const expense = useMemo(
    () => groupByCategory(transactions, 'expense', currentMonth),
    [transactions, currentMonth]
  )

  const income = useMemo(
    () => groupByCategory(transactions, 'income', currentMonth),
    [transactions, currentMonth]
  )

  return (
    <div className="card space-y-5">
      <div className="flex items-center gap-2">
        <LayoutDashboard size={18} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Tổng quan</h2>
        <span className="text-sm text-gray-400">— {monthLabel}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
            <ArrowUpRight size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Chi tiêu</p>
            <p className="text-base font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-primary-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
            <ArrowDownLeft size={18} className="text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Thu nhập</p>
            <p className="text-base font-bold text-primary-600">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <Wallet size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Còn lại</p>
            <p
              className={`text-base font-bold ${
                balance >= 0 ? 'text-gray-900' : 'text-red-600'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        {expense.items.length === 0 && income.items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Thêm giao dịch để xem biểu đồ phân bổ
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <CategoryBreakdown
              title="Chi tiêu theo danh mục"
              items={expense.items}
              total={expense.total}
              emptyMessage="Chưa có chi tiêu tháng này"
              amountColor="text-red-600"
            />
            <div className="hidden lg:block w-px bg-gray-100" />
            <CategoryBreakdown
              title="Thu nhập theo danh mục"
              items={income.items}
              total={income.total}
              emptyMessage="Chưa có thu nhập tháng này"
              amountColor="text-primary-600"
            />
          </div>
        )}
      </div>
    </div>
  )
}
