// Import the real API client for authentication
import { loginUser as realLoginUser, registerUser as realRegisterUser } from "./api-client"
import type { Transaction, User } from "@/types/wallet"
import { Api } from "../src/api/api"
import { formatCurrency } from "./utils"

const api = new Api()

// Helper function to generate unique IDs
const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15)
}

// Mock data for features not yet implemented in the backend
const users: User[] = [
  {
    id: "1",
    email: "usuario@ejemplo.com",
    password: "password123",
    balance: 1000,
  },
  {
    id: "2",
    email: "otro@ejemplo.com",
    password: "password123",
    balance: 500,
  },
]

const transactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    type: "income",
    amount: 500,
    description: "Carga inicial",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    type: "expense",
    amount: 100,
    description: "Pago a otro@ejemplo.com",
    recipient: "otro@ejemplo.com",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    type: "income",
    amount: 600,
    description: "Transferencia recibida de banco",
    sender: "Banco XYZ",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    userId: "1",
    type: "expense",
    amount: 50,
    description: "Compra en tienda",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    userId: "2",
    type: "income",
    amount: 100,
    description: "Transferencia recibida",
    sender: "usuario@ejemplo.com",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper function to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Use real API client for authentication
export { realLoginUser as loginUser, realRegisterUser as registerUser }

// Get user email from cookie
const getUserEmail = (): string => {
    try {
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='))
        if (!userCookie) {
            throw new Error("Usuario no ha iniciado sesión")
        }

        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        if (!userData || !userData.email) {
            throw new Error("No se pudo obtener el email del usuario")
        }

        return userData.email
    } catch (error) {
        console.error("Error getting user email:", error)
        throw new Error(error instanceof Error ? error.message : "Error al obtener el email del usuario")
    }
}

// Función para obtener el email de un usuario por su walletId
const getUserEmailByWalletId = async (walletId: string): Promise<string> => {
    try {
        const response = await fetch(`${api.getBaseUrl()}/wallet/user-email?walletId=${encodeURIComponent(walletId)}`)
        if (!response.ok) {
            throw new Error(`Error getting user email: ${response.statusText}`)
        }
        return await response.text()
    } catch (error) {
        console.error('Error getting user email by wallet ID:', error)
        return `Wallet ${walletId}` // Fallback si no podemos obtener el email
    }
}

export const getUserBalance = async (): Promise<{ balance: number }> => {
    const email = getUserEmail()
    const balance = await api.getBalance(email)
    return { balance }
}

export const getRecentTransactions = async (): Promise<Transaction[]> => {
    try {
        const email = getUserEmail()
        const transactions = await api.getUserTransactions(email)
        console.log('Raw recent transactions from backend:', JSON.stringify(transactions, null, 2))
        
        const mappedTransactions = await Promise.all(transactions.map(async t => {
            console.log('Processing recent transaction:', {
                id: t.id,
                type: t.type,
                amount: t.amount,
                createdAt: t.createdAt,
                relatedWalletId: t.relatedWalletId,
                relatedBankName: t.relatedBankName,
                description: t.description
            })
            
            // Asegurarnos de que la fecha sea válida
            let date = t.createdAt
            if (!date || typeof date !== 'string') {
                console.warn('Invalid date received from backend, using current date:', t)
                date = new Date().toISOString()
            }

            // Obtener el email del wallet relacionado si existe
            let relatedEmail: string | undefined
            if (t.relatedWalletId) {
                try {
                    relatedEmail = await getUserEmailByWalletId(t.relatedWalletId)
                    console.log('Got related email for recent transaction wallet:', {
                        walletId: t.relatedWalletId,
                        email: relatedEmail,
                        transactionType: t.type
                    })
                } catch (error) {
                    console.error('Error getting related email for recent transaction:', error)
                }
            }

            // Determinar sender y recipient basado en el tipo de transacción
            let transactionType: "income" | "expense" | "transfer"
            let sender: string | undefined
            let recipient: string | undefined

            // Mapear el tipo de transacción según el tipo original
            switch (t.type.toLowerCase()) {
                case 'income':
                    transactionType = 'income'
                    sender = relatedEmail || t.relatedBankName || undefined
                    recipient = undefined
                    break
                case 'expense':
                    transactionType = 'expense'
                    recipient = relatedEmail || t.relatedBankName || undefined
                    sender = undefined
                    break
                case 'transfer':
                    transactionType = 'transfer'
                    sender = t.sender
                    recipient = t.recipient
                    break
                default:
                    // Si el tipo no es reconocido, intentamos inferirlo basado en el contexto
                    if (t.relatedWalletId || t.relatedBankName) {
                        // Si hay un wallet o banco relacionado, probablemente sea un gasto
                        transactionType = 'expense'
                        recipient = relatedEmail || t.relatedBankName || undefined
                        sender = undefined
                    } else {
                        // Por defecto, asumimos que es un ingreso
                        transactionType = 'income'
                        sender = t.sender
                        recipient = undefined
                    }
            }
            
            const mappedTransaction = {
                id: t.id || generateId(),
                userId: email,
                type: transactionType,
                amount: t.amount,
                description: t.description || `${transactionType === 'income' ? 'Ingreso' : transactionType === 'expense' ? 'Gasto' : 'Transferencia'} de ${formatCurrency(t.amount)}`,
                date: date,
                sender,
                recipient
            }
            
            console.log('Mapped recent transaction with sender/recipient:', {
                ...mappedTransaction,
                originalType: t.type,
                relatedEmail,
                relatedBankName: t.relatedBankName
            })
            
            return mappedTransaction
        }))

        // Ordenar por fecha (más recientes primero) y tomar las primeras 5
        const recentTransactions = mappedTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
        
        console.log('Recent transactions:', recentTransactions)
        return recentTransactions
    } catch (error) {
        console.error('Error getting recent transactions:', error)
        throw error
    }
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
    try {
        const email = getUserEmail()
        const transactions = await api.getUserTransactions(email)
        console.log('Raw transactions from backend:', JSON.stringify(transactions, null, 2))
        
        const mappedTransactions = await Promise.all(transactions.map(async t => {
            console.log('Processing transaction:', {
                id: t.id,
                type: t.type,
                amount: t.amount,
                relatedWalletId: t.relatedWalletId,
                relatedBankName: t.relatedBankName,
                createdAt: t.createdAt
            })
            
            // Validar y parsear la fecha
            const date = t.createdAt ? new Date(t.createdAt) : new Date()
            if (isNaN(date.getTime())) {
                console.error('Invalid date for transaction:', t.id, t.createdAt)
            }

            // Obtener el email relacionado si existe
            let relatedEmail: string | undefined
            if (t.relatedWalletId) {
                try {
                    const wallet = await getWalletById(t.relatedWalletId)
                    relatedEmail = wallet.email
                    console.log('Got related email for wallet:', {
                        walletId: t.relatedWalletId,
                        email: relatedEmail
                    })
                } catch (error) {
                    console.error('Error getting related wallet email:', error)
                }
            }

            // Determinar sender y recipient basado en el tipo de transacción
            let transactionType: "income" | "expense" | "transfer"
            let sender: string | undefined
            let recipient: string | undefined

            // Mapear el tipo de transacción según el tipo original
            switch (t.type.toLowerCase()) {
                case 'income':
                    transactionType = 'income'
                    sender = relatedEmail || t.relatedBankName || undefined
                    recipient = undefined
                    break
                case 'expense':
                    transactionType = 'expense'
                    recipient = relatedEmail || t.relatedBankName || undefined
                    sender = undefined
                    break
                case 'transfer':
                    transactionType = 'transfer'
                    sender = t.sender
                    recipient = t.recipient
                    break
                default:
                    // Si el tipo no es reconocido, intentamos inferirlo basado en el contexto
                    if (t.relatedWalletId || t.relatedBankName) {
                        // Si hay un wallet o banco relacionado, probablemente sea un gasto
                        transactionType = 'expense'
                        recipient = relatedEmail || t.relatedBankName || undefined
                        sender = undefined
                    } else {
                        // Por defecto, asumimos que es un ingreso
                        transactionType = 'income'
                        sender = t.sender
                        recipient = undefined
                    }
            }
            
            // Generar la descripción basada en el tipo y el monto
            const amount = formatCurrency(t.amount)
            let description: string
            if (transactionType === 'income') {
                description = sender ? `Ingreso de ${amount} de ${sender}` : `Ingreso de ${amount}`
            } else if (transactionType === 'expense') {
                description = recipient ? `Gasto de ${amount} a ${recipient}` : `Gasto de ${amount}`
            } else if (transactionType === 'transfer') {
                description = recipient ? `Transferencia de ${amount} a ${recipient}` : `Transferencia de ${amount}`
            } else {
                description = `${transactionType} de ${amount}`
            }

            console.log('Mapped transaction with sender/recipient:', {
                id: t.id,
                type: transactionType,
                amount: t.amount,
    description,
                sender,
                recipient,
                relatedEmail,
                relatedBankName: t.relatedBankName
            })

            return {
                id: t.id,
                userId: email,
                type: transactionType,
                amount: t.amount,
                description,
                date: date.toISOString(),
                sender,
                recipient,
                relatedWalletId: t.relatedWalletId,
                relatedBankName: t.relatedBankName
            }
        }))
        
        console.log('All mapped transactions:', mappedTransactions)
        return mappedTransactions
    } catch (error) {
        console.error('Error getting transactions:', error)
        throw error
    }
}

export const transferMoney = async (recipient: string, amount: number, description: string): Promise<void> => {
    const senderEmail = getUserEmail()
    await api.transfer(senderEmail, recipient, amount)
}

export const addMoneyToWallet = async (amount: number, method: string): Promise<void> => {
    // TODO: Implement when backend endpoint is available
    console.log(`Adding ${amount} via ${method}`)
}

export const requestDebin = async (bankName: string, accountNumber: string, amount: number): Promise<void> => {
    try {
        const email = getUserEmail()
        // Extraer solo los números del número de cuenta para usarlo como CBU
        const cbu = accountNumber.replace(/\D/g, '')
        const response = await api.requestInstantDebit({
            receiverEmail: email,
            bankName: bankName,
            amount: amount,
            cbu: cbu
        })
    } catch (error: any) {
        // Si el error tiene una respuesta del backend, intentamos obtener el mensaje
        if (error.response) {
            try {
                const errorData = await error.response.json()
                // Si el backend devuelve un ApiResponse, usamos su message
                if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                    throw new Error(errorData.message)
                }
                // Si no hay mensaje específico pero hay un body, lo usamos
                if (typeof errorData === 'string') {
                    throw new Error(errorData)
                }
            } catch (parseError) {
                console.error('Error parsing error response:', parseError)
            }
  }

        // Si el error ya tiene un mensaje, lo usamos
        if (error instanceof Error && error.message) {
            throw error
        }
        
        // Si no pudimos obtener un mensaje específico, lanzamos un error genérico
        throw new Error('Error al procesar el DEBIN')
    }
}

// Agregar la función getWalletById
const getWalletById = async (walletId: string): Promise<{ email: string }> => {
    const response = await fetch(`${api.getBaseUrl()}/wallet/user-email?walletId=${walletId}`)
    if (!response.ok) {
        throw new Error('Failed to fetch wallet')
    }
    const email = await response.text()
    return { email }
}
