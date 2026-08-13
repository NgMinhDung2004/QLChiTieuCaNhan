import { useMemo, useState } from 'react'
import { Calendar, Filter, Pencil, Trash2, Inbox } from 'lucide-react'
import type { Transaction, TransactionType } from '../types'
import { ALL_CATEGORIES, EXPENSE_CATEGORIES, getCategoryById } from '../types'
import { formatCurrency, formatDate } from '../utils'
import CategoryIcon from './CategoryIcon'
import ConfirmDialog from './ConfirmDialog'

type DateFilterMode = 'all' | 'date' | 'month' | 'year'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

interface Filters {
  dateMode: DateFilterMode
  dateValue: string
  categoryId: string
  type: TransactionType | 'all'
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function currentMonthString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function currentYearString() {
  return String(new Date().getFullYear())
}

function matchesDateFilter(tx: Transaction, mode: DateFilterMode, value: string): boolean {
  if (mode === 'all' || !value) return true
  if (mode === 'date') return tx.date === value
  if (mode === 'month') return tx.date.startsWith(value)
  if (mode === 'year') return tx.date.startsWith(value)
  return true
}

function matchesFilters(tx: Transaction, filters: Filters): boolean {
  if (!matchesDateFilter(tx, filters.dateMode, filters.dateValue)) return false
  if (filters.categoryId !== 'all' && tx.categoryId !== filters.categoryId) return false
  if (filters.type !== 'all' && tx.type !== filters.type) return false
  return true
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [filters, setFilters] = useState<Filters>({
    dateMode: 'all',
    dateValue: '',
    categoryId: 'all',
    type: 'expense',
  })

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => matchesFilters(tx, filters))
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  }, [transactions, filters])

  const totalAmount = useMemo(
    () => filtered.reduce((sum, tx) => sum + tx.amount, 0),
    [filtered]
  )

  function updateDateMode(mode: DateFilterMode) {
    setFilters((prev) => {
      let dateValue = ''
      if (mode === 'date') dateValue = todayString()
      if (mode === 'month') dateValue = currentMonthString()
      if (mode === 'year') dateValue = currentYearString()
      return { ...prev, dateMode: mode, dateValue }
    })
  }

  function resetFilters() {
    setFilters({
      dateMode: 'all',
      dateValue: '',
      categoryId: 'all',
      type: 'expense',
    })
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  const categoryOptions =
    filters.type === 'income'
      ? ALL_CATEGORIES.filter((c) => c.type === 'income')
      : filters.type === 'expense'
        ? EXPENSE_CATEGORIES
        : ALL_CATEGORIES

  return (
    <>
      <div className="card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách giao dịch</h2>
          <span className="text-sm text-gray-500">{filtered.length} giao dịch</span>
        </div>

        {/* Bộ lọc */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Filter size={16} />
            Bộ lọc
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">Loại</label>
              <select
                value={filters.type}
                onChange={(e) => {
                  const type = e.target.value as Filters['type']
                  setFilters((prev) => ({ ...prev, type, categoryId: 'all' }))
                }}
                className="input py-2"
              >
                <option value="expense">Chi tiêu</option>
                <option value="income">Thu nhập</option>
                <option value="all">Tất cả</option>
              </select>
            </div>

            <div>
              <label className="label text-xs">Lọc theo thời gian</label>
              <select
                value={filters.dateMode}
                onChange={(e) => updateDateMode(e.target.value as DateFilterMode)}
                className="input py-2"
              >
                <option value="all">Tất cả</option>
                <option value="date">Theo ngày</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>

            {filters.dateMode !== 'all' && (
              <div className="sm:col-span-2">
                <label className="label text-xs">
                  {filters.dateMode === 'date' && 'Chọn ngày'}
                  {filters.dateMode === 'month' && 'Chọn tháng'}
                  {filters.dateMode === 'year' && 'Chọn năm'}
                </label>
                <div className="relative">
                  {filters.dateMode === 'year' ? (
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={filters.dateValue}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, dateValue: e.target.value }))
                      }
                      className="input py-2 pl-11"
                      placeholder="VD: 2026"
                    />
                  ) : (
                    <input
                      type={filters.dateMode === 'date' ? 'date' : 'month'}
                      value={filters.dateValue}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, dateValue: e.target.value }))
                      }
                      className="input py-2 pl-11"
                    />
                  )}
                  <Calendar
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="label text-xs">Danh mục</label>
              <select
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                className="input py-2"
              >
                <option value="all">Tất cả danh mục</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="button" onClick={resetFilters} className="btn-secondary text-xs py-2">
            Đặt lại bộ lọc
          </button>
        </div>

        {/* Tổng */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-gray-600">Tổng cộng</span>
            <span
              className={`text-lg font-bold ${
                filters.type === 'income' ? 'text-primary-600' : 'text-red-600'
              }`}
            >
              {filters.type === 'income' ? '+' : filters.type === 'all' ? '' : '-'}
              {formatCurrency(totalAmount)}
            </span>
          </div>
        )}

        {/* Bảng */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Inbox size={48} strokeWidth={1.5} />
            <p className="mt-3 text-sm">Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Ngày</th>
                  <th className="pb-3 pr-4 font-medium">Danh mục</th>
                  <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Mô tả</th>
                  <th className="pb-3 pr-4 font-medium text-right">Số tiền</th>
                  <th className="pb-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((tx) => {
                  const category = getCategoryById(tx.categoryId)
                  return (
                    <tr key={tx.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4 whitespace-nowrap text-gray-700">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          {category && (
                            <CategoryIcon
                              icon={category.icon}
                              color={category.color}
                              size="sm"
                            />
                          )}
                          <span className="text-gray-700 whitespace-nowrap">
                            {category?.name ?? 'Khác'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-500 hidden sm:table-cell max-w-[200px] truncate">
                        {tx.description || '—'}
                      </td>
                      <td
                        className={`py-3 pr-4 text-right font-semibold whitespace-nowrap ${
                          tx.type === 'income' ? 'text-primary-600' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(tx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                            title="Sửa giao dịch"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(tx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Xóa giao dịch"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa giao dịch"
        message="Bạn có muốn xóa giao dịch này hay không?"
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
