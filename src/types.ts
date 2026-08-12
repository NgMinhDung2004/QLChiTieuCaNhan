export type TransactionType = 'expense' | 'income'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string
  createdAt: string
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Ăn uống', icon: 'UtensilsCrossed', color: '#f97316', type: 'expense' },
  { id: 'shopping', name: 'Mua sắm', icon: 'ShoppingBag', color: '#ec4899', type: 'expense' },
  { id: 'transport', name: 'Di chuyển', icon: 'Car', color: '#3b82f6', type: 'expense' },
  { id: 'entertainment', name: 'Giải trí', icon: 'Gamepad2', color: '#a855f7', type: 'expense' },
  { id: 'bills', name: 'Hóa đơn', icon: 'Receipt', color: '#ef4444', type: 'expense' },
  { id: 'health', name: 'Sức khỏe', icon: 'Heart', color: '#14b8a6', type: 'expense' },
  { id: 'education', name: 'Học tập', icon: 'GraduationCap', color: '#6366f1', type: 'expense' },
  { id: 'other-expense', name: 'Khác', icon: 'MoreHorizontal', color: '#6b7280', type: 'expense' },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Lương', icon: 'Briefcase', color: '#22c55e', type: 'income' },
  { id: 'bonus', name: 'Thưởng', icon: 'Gift', color: '#eab308', type: 'income' },
  { id: 'investment', name: 'Đầu tư', icon: 'TrendingUp', color: '#06b6d4', type: 'income' },
  { id: 'other-income', name: 'Khác', icon: 'MoreHorizontal', color: '#6b7280', type: 'income' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id)
}
