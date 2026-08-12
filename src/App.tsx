import Header from './components/Header'
import TransactionForm, { type TransactionFormData } from './components/TransactionForm'
import { useTransactions } from './hooks/useTransactions'

export default function App() {
  const { addTransaction } = useTransactions()

  function handleSubmit(data: TransactionFormData) {
    addTransaction(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <TransactionForm onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
