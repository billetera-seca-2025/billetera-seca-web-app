export interface User {
  id: string
  email: string
  password?: string
  balance: number
}

export interface Transaction {
  id: string
  userId: string
  type: "income" | "expense" | "transfer"
  amount: number
  description?: string
  recipient?: string
  sender?: string
  date: string
  createdAt?: string
  relatedWalletId?: string
  relatedBankName?: string
}
