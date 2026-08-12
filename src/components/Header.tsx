import { Wallet } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">QL Chi Tiêu</h1>
          <p className="text-xs text-gray-500">Quản lý chi tiêu cá nhân</p>
        </div>
      </div>
    </header>
  )
}
