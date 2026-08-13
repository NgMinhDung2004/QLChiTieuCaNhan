import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import type { Transaction, TransactionType } from '../types'
import { getCategoryById } from '../types'
import { formatCurrency, getMonthKey } from '../utils'

interface CategoryChartProps {
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
): ChartItem[] {
  const filtered = transactions.filter(
    (tx) => tx.type === type && tx.date.startsWith(monthKey)
  )
  const total = filtered.reduce((sum, tx) => sum + tx.amount, 0)
  if (total === 0) return []

  const grouped = new Map<string, number>()
  for (const tx of filtered) {
    grouped.set(tx.categoryId, (grouped.get(tx.categoryId) ?? 0) + tx.amount)
  }

  return Array.from(grouped.entries())
    .map(([categoryId, value]) => {
      const category = getCategoryById(categoryId)
      return {
        name: category?.name ?? 'Khác',
        value,
        color: category?.color ?? '#6b7280',
        percent: Math.round((value / total) * 100),
      }
    })
    .sort((a, b) => b.value - a.value)
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: ChartItem }[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{item.name}</p>
      <p className="text-gray-600">{formatCurrency(item.value)}</p>
      <p className="text-gray-400">{item.percent}%</p>
    </div>
  )
}

function renderLabel({ name, percent }: { name: string; percent?: number }) {
  const p = Math.round((percent ?? 0) * 100)
  return p >= 5 ? `${name} ${p}%` : ''
}

function SingleChart({
  title,
  data,
  emptyMessage,
}: {
  title: string
  data: ChartItem[]
  emptyMessage: string
}) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-sm text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={(props) =>
                renderLabel({ name: String(props.name ?? ''), percent: props.percent })
              }
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const currentMonth = getMonthKey(new Date())

  const expenseData = useMemo(
    () => groupByCategory(transactions, 'expense', currentMonth),
    [transactions, currentMonth]
  )

  const incomeData = useMemo(
    () => groupByCategory(transactions, 'income', currentMonth),
    [transactions, currentMonth]
  )

  const hasData = expenseData.length > 0 || incomeData.length > 0

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <PieChartIcon size={18} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Phân bổ theo danh mục</h2>
      </div>

      {!hasData && (
        <p className="text-sm text-gray-400 text-center py-4">
          Thêm giao dịch để xem biểu đồ phân bổ
        </p>
      )}

      {hasData && (
        <div className="flex flex-col sm:flex-row gap-6">
          <SingleChart
            title="Chi tiêu"
            data={expenseData}
            emptyMessage="Chưa có chi tiêu tháng này"
          />
          <SingleChart
            title="Thu nhập"
            data={incomeData}
            emptyMessage="Chưa có thu nhập tháng này"
          />
        </div>
      )}
    </div>
  )
}
