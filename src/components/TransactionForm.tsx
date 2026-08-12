import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Calendar, X } from 'lucide-react'
import type { Transaction, TransactionType } from '../types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types'
import CategoryIcon from './CategoryIcon'

export interface TransactionFormData {
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void
  onCancel?: () => void
  initialData?: Transaction
  submitLabel?: string
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function parseAmountInput(value: string): string {
  return value.replace(/[^\d]/g, '')
}

function formatAmountDisplay(value: string): string {
  if (!value) return ''
  return Number(value).toLocaleString('vi-VN')
}

export default function TransactionForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Thêm giao dịch',
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'expense')
  const [amountRaw, setAmountRaw] = useState(
    initialData ? String(initialData.amount) : ''
  )
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? EXPENSE_CATEGORIES[0].id
  )
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [date, setDate] = useState(initialData?.date ?? todayString())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  function handleTypeChange(newType: TransactionType) {
    setType(newType)
    setCategoryId(
      newType === 'expense' ? EXPENSE_CATEGORIES[0].id : INCOME_CATEGORIES[0].id
    )
    setErrors({})
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    const amount = Number(amountRaw)

    if (!amountRaw || amount <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ'
    }
    if (!categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục'
    }
    if (!date) {
      newErrors.date = 'Vui lòng chọn ngày'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      type,
      amount: Number(amountRaw),
      categoryId,
      description: description.trim(),
      date,
    })

    if (!initialData) {
      setAmountRaw('')
      setDescription('')
      setDate(todayString())
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {initialData ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Loại giao dịch */}
      <div>
        <label className="label">Loại giao dịch</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all ${
              type === 'expense'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <ArrowUpRight size={18} />
            Chi tiêu
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all ${
              type === 'income'
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <ArrowDownLeft size={18} />
            Thu nhập
          </button>
        </div>
      </div>

      {/* Số tiền */}
      <div>
        <label htmlFor="amount" className="label">
          Số tiền
        </label>
        <div className="relative">
          <input
            id="amount"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={formatAmountDisplay(amountRaw)}
            onChange={(e) => setAmountRaw(parseAmountInput(e.target.value))}
            className={`input text-lg font-semibold pr-12 ${
              errors.amount ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
            VNĐ
          </span>
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
        )}
      </div>

      {/* Danh mục */}
      <div>
        <label className="label">Danh mục</label>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all ${
                categoryId === cat.id
                  ? 'bg-gray-100 ring-2 ring-primary-500 ring-offset-1'
                  : 'hover:bg-gray-50'
              }`}
            >
              <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
              <span className="text-xs text-gray-600 text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <label htmlFor="description" className="label">
          Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span>
        </label>
        <input
          id="description"
          type="text"
          placeholder="Ví dụ: Ăn trưa với bạn..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
      </div>

      {/* Ngày */}
      <div>
        <label htmlFor="date" className="label">
          Ngày giao dịch
        </label>
        <div className="relative">
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`input pl-11 ${
              errors.date ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />
          <Calendar
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-xs text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Nút submit */}
      <button type="submit" className="btn-primary w-full py-3 text-base">
        {submitLabel}
      </button>
    </form>
  )
}
