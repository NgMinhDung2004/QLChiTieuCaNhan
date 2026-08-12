import { useState, useEffect, useCallback } from 'react'
import type { Transaction } from '../types'
import { generateId } from '../utils'

const STORAGE_KEY = 'ql-chi-tieu-transactions'

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Transaction[]
  } catch {
    return []
  }
}

function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions)

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt'>) => {
      const newTx: Transaction = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      setTransactions((prev) => [newTx, ...prev])
    },
    []
  )

  const updateTransaction = useCallback(
    (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
      )
    },
    []
  )

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }, [])

  return { transactions, addTransaction, updateTransaction, deleteTransaction }
}
