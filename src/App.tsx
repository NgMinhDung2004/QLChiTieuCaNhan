import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Transaction } from './types'
import Header from './components/Header'
import Overview from './components/Overview'
import TransactionForm, { type TransactionFormData } from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import { useTransactions } from './hooks/useTransactions'

export default function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showForm, setShowForm] = useState(false)

  function handleSubmit(data: TransactionFormData) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
      setEditingTransaction(null)
    } else {
      addTransaction(data)
    }
    setShowForm(false)
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  function handleCancel() {
    setEditingTransaction(null)
    setShowForm(false)
  }

  function handleAddNew() {
    setEditingTransaction(null)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {showForm ? (
          <TransactionForm
            key={editingTransaction?.id ?? 'new'}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingTransaction ?? undefined}
            submitLabel={editingTransaction ? 'Cập nhật giao dịch' : 'Thêm giao dịch'}
          />
        ) : (
          <>
            <Overview transactions={transactions} />

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h2>
              <button type="button" onClick={handleAddNew} className="btn-primary py-2">
                <Plus size={18} />
                Thêm giao dịch
              </button>
            </div>

            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
            />
          </>
        )}
      </main>
    </div>
  )
}
