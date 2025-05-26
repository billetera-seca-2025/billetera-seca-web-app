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

// Agregar tipos para las wallets
interface Wallet {
    id: string
    email: string
    balance: number
    createdAt: string
}

// Agregar funciones para manejar múltiples wallets
export const getWallets = async (): Promise<Wallet[]> => {
    try {
        const email = getUserEmail()
        const response = await fetch(`${api.getBaseUrl()}/wallet/wallets?email=${encodeURIComponent(email)}`)
        if (!response.ok) {
            throw new Error('Failed to fetch wallets')
        }
        return await response.json()
    } catch (error) {
        console.error('Error getting wallets:', error)
        throw error
    }
}

export const createWallet = async (initialBalance: number = 0): Promise<Wallet> => {
    try {
        const email = getUserEmail()
        const response = await fetch(`${api.getBaseUrl()}/wallet/create?email=${encodeURIComponent(email)}&initialBalance=${initialBalance}`, {
            method: 'POST'
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create wallet')
        }
        
        return await response.json()
    } catch (error) {
        console.error('Error creating wallet:', error)
        throw error
    }
}

// Modificar getUserBalance para soportar walletId opcional
export const getUserBalance = async (walletId?: string): Promise<{ balance: number }> => {
    const email = getUserEmail()
    const balance = await api.getBalance(email, walletId)
    return { balance }
}

export const getAllTransactions = async (walletId?: string): Promise<Transaction[]> => {
    try {
        const email = getUserEmail()
        let transactions: Transaction[]
        
        if (walletId) {
            // Si se proporciona un walletId, obtener las transacciones de esa wallet específica
            transactions = await api.getWalletTransactions(walletId)
            console.log('Raw wallet transactions from backend:', JSON.stringify(transactions, null, 2))
        } else {
            // Si no se proporciona walletId, obtener todas las transacciones del usuario
            transactions = await api.getUserTransactions(email)
            console.log('Raw user transactions from backend:', JSON.stringify(transactions, null, 2))
        }
        
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

            // Determinar el tipo de transacción y asignar sender/recipient
            const transactionType = t.type.toUpperCase()
            let sender: string | undefined
            let recipient: string | undefined

            // Asignar sender/recipient basado en el tipo de transacción
            if (transactionType === 'INCOME') {
                // Para INCOME, el sender es la wallet relacionada
                sender = relatedEmail || t.relatedBankName
                recipient = undefined
            } else if (transactionType === 'OUTCOME') {
                // Para OUTCOME, el recipient es la wallet relacionada
                sender = undefined
                recipient = relatedEmail || t.relatedBankName
            }

            // Generar la descripción basada en el tipo y el monto
            const amount = formatCurrency(t.amount)
            let description: string
            if (transactionType === 'INCOME') {
                description = sender ? `Ingreso de ${amount} de ${sender}` : `Ingreso de ${amount}`
            } else if (transactionType === 'OUTCOME') {
                description = recipient ? `Gasto de ${amount} a ${recipient}` : `Gasto de ${amount}`
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
                type: transactionType.toLowerCase() as 'income' | 'expense',
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

export const getRecentTransactions = async (walletId?: string): Promise<Transaction[]> => {
    try {
        const email = getUserEmail()
        let transactions: Transaction[]
        
        if (walletId) {
            // Si se proporciona un walletId, obtener las transacciones de esa wallet específica
            transactions = await api.getWalletTransactions(walletId)
            console.log('Raw recent wallet transactions from backend:', JSON.stringify(transactions, null, 2))
        } else {
            // Si no se proporciona walletId, obtener todas las transacciones del usuario
            transactions = await api.getUserTransactions(email)
            console.log('Raw recent user transactions from backend:', JSON.stringify(transactions, null, 2))
        }
        
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
            let transactionType = t.type
            let sender: string | undefined
            let recipient: string | undefined

            // Corrección temporal: Si es una transacción OUTCOME pero tiene un relatedWalletId,
            // probablemente sea un INCOME que fue marcado incorrectamente
            if (t.type.toUpperCase() === 'OUTCOME' && t.relatedWalletId) {
                console.log('Correcting transaction type from OUTCOME to INCOME due to relatedWalletId')
                transactionType = 'income'
                sender = relatedEmail
                recipient = undefined
            }
            // Para gastos (OUTCOME) normales
            else if (t.type.toUpperCase() === 'OUTCOME') {
                transactionType = 'expense'
                recipient = relatedEmail || t.relatedBankName || undefined
                sender = undefined
            }
            // Para ingresos (INCOME)
            else if (t.type.toUpperCase() === 'INCOME') {
                transactionType = 'income'
                sender = relatedEmail || t.relatedBankName || undefined
                recipient = undefined
            }
            // Para otros tipos, mantener la lógica existente
            else {
                transactionType = t.type
                sender = t.sender
                recipient = t.recipient
            }
            
            const mappedTransaction = {
                id: t.id || generateId(),
                userId: email,
                type: transactionType,
                amount: t.amount,
                description: t.description || `${transactionType === 'income' ? 'Ingreso' : 'Gasto'} de ${formatCurrency(t.amount)}`,
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

// Modificar transferMoney para soportar walletIds opcionales
export const transferMoney = async (
    recipient: string, 
    amount: number, 
    description: string,
    senderWalletId?: string,
    receiverWalletId?: string
): Promise<void> => {
    const senderEmail = getUserEmail()
    await api.transfer(senderEmail, recipient, amount, senderWalletId, receiverWalletId)
}

export const addMoneyToWallet = async (amount: number, method: string): Promise<void> => {
    // TODO: Implement when backend endpoint is available
    console.log(`Adding ${amount} via ${method}`)
}

// Modificar requestDebin para soportar walletId opcional
export const requestDebin = async (
    bankName: string, 
    accountNumber: string, 
    amount: number,
    walletId?: string
): Promise<void> => {
    try {
        const email = getUserEmail()
        const response = await api.requestInstantDebit({
            receiverEmail: email,
            bankName: bankName,
            amount: amount,
            walletId: walletId
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
