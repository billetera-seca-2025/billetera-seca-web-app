// Simulación de API para la billetera electrónica
import type { Transaction, User } from "@/types/wallet"

// Datos simulados
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

// Función para generar IDs únicos
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

// Función para simular delay de red
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Autenticación
export const registerUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await delay(1000) // Simular delay de red

  // Verificar si el usuario ya existe
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    throw new Error("El usuario ya existe")
  }

  // Crear nuevo usuario
  const newUser: User = {
    id: generateId(),
    email,
    password,
    balance: 0,
  }

  users.push(newUser)

  // Simular token JWT
  const token = `token_${newUser.id}_${Date.now()}`

  return {
    user: { ...newUser, password: undefined },
    token,
  }
}

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await delay(1000) // Simular delay de red

  // Buscar usuario
  const user = users.find((user) => user.email === email && user.password === password)
  if (!user) {
    throw new Error("Credenciales incorrectas")
  }

  // Simular token JWT
  const token = `token_${user.id}_${Date.now()}`

  return {
    user: { ...user, password: undefined },
    token,
  }
}

// Operaciones de billetera
export const getUserBalance = async (): Promise<{ balance: number }> => {
  await delay(500) // Simular delay de red

  // En una aplicación real, obtendríamos el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const user = users[0]

  return {
    balance: user.balance,
  }
}

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  await delay(800) // Simular delay de red

  // En una aplicación real, filtraríamos por el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const userId = "1"

  return transactions
    .filter((transaction) => transaction.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  await delay(1000) // Simular delay de red

  // En una aplicación real, filtraríamos por el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const userId = "1"

  return transactions
    .filter((transaction) => transaction.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const transferMoney = async (recipient: string, amount: number, description: string): Promise<void> => {
  await delay(1500) // Simular delay de red

  // En una aplicación real, obtendríamos el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const senderId = "1"
  const sender = users.find((user) => user.id === senderId)

  if (!sender) {
    throw new Error("Usuario no encontrado")
  }

  if (sender.balance < amount) {
    throw new Error("Saldo insuficiente")
  }

  // Buscar destinatario (por email o ID)
  const recipientUser = users.find((user) => user.email === recipient || user.id === recipient)

  if (!recipientUser) {
    throw new Error("Destinatario no encontrado")
  }

  // Actualizar saldos
  sender.balance -= amount
  recipientUser.balance += amount

  // Registrar transacciones
  const transactionId = generateId()
  const date = new Date().toISOString()

  // Transacción de gasto para el remitente
  transactions.push({
    id: transactionId,
    userId: sender.id,
    type: "expense",
    amount,
    description,
    recipient: recipientUser.email,
    date,
  })

  // Transacción de ingreso para el destinatario
  transactions.push({
    id: generateId(),
    userId: recipientUser.id,
    type: "income",
    amount,
    description: `Transferencia recibida de ${sender.email}`,
    sender: sender.email,
    date,
  })
}

export const addMoneyToWallet = async (amount: number, method: string): Promise<void> => {
  await delay(1500) // Simular delay de red

  // En una aplicación real, obtendríamos el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const userId = "1"
  const user = users.find((user) => user.id === userId)

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  // Actualizar saldo
  user.balance += amount

  // Registrar transacción
  transactions.push({
    id: generateId(),
    userId,
    type: "income",
    amount,
    description: `Carga de saldo vía ${method}`,
    date: new Date().toISOString(),
  })
}

export const requestDebin = async (bankName: string, accountNumber: string, amount: number): Promise<void> => {
  await delay(2000) // Simular delay de red

  // En una aplicación real, obtendríamos el ID del usuario del token
  // Aquí simplemente usamos el primer usuario para simular
  const userId = "1"
  const user = users.find((user) => user.id === userId)

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  // Simular aprobación del DEBIN
  // En una aplicación real, esto sería un proceso asíncrono con el banco

  // Actualizar saldo
  user.balance += amount

  // Registrar transacción
  transactions.push({
    id: generateId(),
    userId,
    type: "income",
    amount,
    description: `DEBIN desde ${bankName}`,
    sender: `Banco ${bankName}`,
    date: new Date().toISOString(),
  })
}
