"use client"

import {useEffect, useState} from "react"
import {ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, EyeOff, MoreHorizontal, Plus, Send} from "lucide-react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {getRecentTransactions, getUserBalance} from "@/lib/api"
import {formatCurrency, formatDate} from "@/lib/utils"
import type {Transaction} from "@/types/wallet"
import {TEXT, URLS} from "@/lib/constants"

const getTransactionStyle = (type: string) => {
    switch (type) {
        case 'income':
            return {
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
                icon: <ArrowDownIcon className="h-5 w-5 text-green-600"/>,
                sign: '+'
            }
        case 'expense':
            return {
                bgColor: 'bg-red-100',
                textColor: 'text-red-600',
                icon: <ArrowUpIcon className="h-5 w-5 text-red-600"/>,
                sign: '-'
            }
        case 'transfer':
            return {
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
                icon: <ArrowUpIcon className="h-5 w-5 text-blue-600"/>,
                sign: '-'
            }
        default:
            return {
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-600',
                icon: <ArrowUpIcon className="h-5 w-5 text-blue-600"/>,
                sign: '-'
            }
    }
}

const getTransactionKey = (transaction: Transaction, index: number) => {
    // Si el ID es undefined, usamos el índice como parte de la key
    const id = transaction.id || `index-${index}`
    return `${id}-${transaction.date}-${transaction.type}-${index}`
}

const getTransactionDescription = (transaction: Transaction) => {
    const amount = formatCurrency(transaction.amount)
    
    // Si hay una descripción personalizada, usarla
    if (transaction.description) {
        return transaction.description
    }
    
    // Determinar la descripción basada en el tipo de transacción
    switch (transaction.type) {
        case 'income':
            if (transaction.sender) {
                return `Ingreso de ${amount} de ${transaction.sender}`
            }
            return `Ingreso de ${amount}`
        case 'expense':
            if (transaction.recipient) {
                return `Gasto de ${amount} a ${transaction.recipient}`
            }
            return `Gasto de ${amount}`
        case 'transfer':
            if (transaction.recipient) {
                return `Transferencia de ${amount} a ${transaction.recipient}`
            }
            return `Transferencia de ${amount}`
        default:
            return `${transaction.type} de ${amount}`
    }
}

export default function Dashboard() {
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check if user is logged in from cookies
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='))
        if (!userCookie) {
            router.push(URLS.login)
            return
        }

        const fetchData = async () => {
            try {
                setError(null)
                const [balanceData, transactionsData] = await Promise.all([
                    getUserBalance(),
                    getRecentTransactions()
                ])
                
                console.log('Transactions received in Dashboard:', transactionsData.map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: t.amount,
                    description: t.description,
                    sender: t.sender,
                    recipient: t.recipient,
                    date: t.date
                })))
                
                setBalance(balanceData.balance)
                setTransactions(transactionsData)
            } catch (error) {
                console.error("Error fetching data:", error)
                setError(error instanceof Error ? error.message : "Error al cargar los datos")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [router])

    if (isLoading) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p>{TEXT.common.loading}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    className="md:col-span-2 bg-gradient-to-br from-primary/5 to-background shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{TEXT.dashboard.balance}</CardTitle>
                            <CardDescription>{TEXT.dashboard.balanceDescription}</CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsVisible(!isVisible)}>
                                    {TEXT.dashboard.dropdownOptions.hideBalance}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        {isVisible ? (
                            <div className="text-5xl font-bold text-center py-8">{formatCurrency(balance)}</div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <EyeOff className="h-16 w-16"/>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>{TEXT.dashboard.quickActions}</CardTitle>
                        <CardDescription>{TEXT.dashboard.quickActionsDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Button
                            asChild
                            variant="outline"
                            className="h-24 flex flex-col bg-gradient-to-br from-blue-50 to-background hover:from-blue-100 border-blue-200"
                        >
                            <Link href={URLS.transfer}>
                                <Send className="h-8 w-8 mb-2 text-blue-500"/>
                                <span>{TEXT.dashboard.actions.transfer}</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-24 flex flex-col bg-gradient-to-br from-green-50 to-background hover:from-green-100 border-green-200"
                        >
                            <Link href={URLS.addMoney}>
                                <Plus className="h-8 w-8 mb-2 text-green-500"/>
                                <span>{TEXT.dashboard.actions.add}</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-24 flex flex-col bg-gradient-to-br from-amber-50 to-background hover:from-amber-100 border-amber-200"
                        >
                            <Link href={URLS.requestDebin}>
                                <DollarSign className="h-8 w-8 mb-2 text-amber-500"/>
                                <span>{TEXT.dashboard.actions.debin}</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-24 flex flex-col bg-gradient-to-br from-purple-50 to-background hover:from-purple-100 border-purple-200"
                        >
                            <Link href={URLS.linkCard}>
                                <CreditCard className="h-8 w-8 mb-2 text-purple-500"/>
                                <span>{TEXT.dashboard.actions.link}</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Tabs defaultValue="recent">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="recent">{TEXT.dashboard.tabs.recent}</TabsTrigger>
                            <TabsTrigger value="income">{TEXT.dashboard.tabs.income}</TabsTrigger>
                            <TabsTrigger value="expenses">{TEXT.dashboard.tabs.expenses}</TabsTrigger>
                        </TabsList>
                        <Button asChild variant="outline" size="sm">
                            <Link href={URLS.transactions}>{TEXT.common.seeAll}</Link>
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                            {error}
                        </div>
                    )}

                    <TabsContent value="recent" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{TEXT.dashboard.recentTransactions}</CardTitle>
                                <CardDescription>{TEXT.dashboard.recentTransactionsDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions.map((transaction, index) => {
                                            console.log('Rendering transaction:', {
                                                id: transaction.id,
                                                type: transaction.type,
                                                sender: transaction.sender,
                                                recipient: transaction.recipient,
                                                description: transaction.description
                                            })
                                            
                                            const style = getTransactionStyle(transaction.type)
                                            const description = getTransactionDescription(transaction)
                                            return (
                                                <div 
                                                    key={getTransactionKey(transaction, index)} 
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-full ${style.bgColor}`}>
                                                            {style.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="font-medium">{description}</p>
                                                            <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                                                <span>{formatDate(transaction.date)}</span>
                                                                {transaction.recipient && (
                                                                    <>
                                                                        <span className="hidden sm:inline">•</span>
                                                                        <span className="text-sm">
                                                                            {TEXT.transactions.details.to}: {transaction.recipient}
                                                                        </span>
                                                                    </>
                                                                )}
                                                                {transaction.sender && (
                                                                    <>
                                                                        <span className="hidden sm:inline">•</span>
                                                                        <span className="text-sm">
                                                                            {TEXT.transactions.details.from}: {transaction.sender}
                                                                        </span>
                                                                    </>
                                                        )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`font-medium ${style.textColor}`}>
                                                        {style.sign}{formatCurrency(transaction.amount)}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">{TEXT.dashboard.noTransactions}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="income" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ingresos</CardTitle>
                                <CardDescription>Historial de ingresos a tu billetera</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.filter(t => t.type === 'income').length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions
                                            .filter(t => t.type === 'income')
                                            .map((transaction, index) => {
                                                const style = getTransactionStyle(transaction.type)
                                                const description = getTransactionDescription(transaction)
                                                return (
                                                    <div 
                                                        key={getTransactionKey(transaction, index)} 
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                    >
                                                    <div className="flex items-center gap-4">
                                                            <div className={`p-2 rounded-full ${style.bgColor}`}>
                                                                {style.icon}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="font-medium">{description}</p>
                                                                <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                                                    <span>{formatDate(transaction.date)}</span>
                                                                    {transaction.sender && (
                                                                        <>
                                                                            <span className="hidden sm:inline">•</span>
                                                                            <span className="text-sm">
                                                                                {TEXT.transactions.details.from}: {transaction.sender}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`font-medium ${style.textColor}`}>
                                                            {style.sign}{formatCurrency(transaction.amount)}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">{TEXT.dashboard.noIncome}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="expenses" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gastos</CardTitle>
                                <CardDescription>Historial de gastos de tu billetera</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.filter(t => t.type === 'expense').length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions
                                            .filter(t => t.type === 'expense')
                                            .map((transaction, index) => {
                                                const style = getTransactionStyle(transaction.type)
                                                const description = getTransactionDescription(transaction)
                                                return (
                                                    <div 
                                                        key={getTransactionKey(transaction, index)} 
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                    >
                                                    <div className="flex items-center gap-4">
                                                            <div className={`p-2 rounded-full ${style.bgColor}`}>
                                                                {style.icon}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="font-medium">{description}</p>
                                                                <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                                                    <span>{formatDate(transaction.date)}</span>
                                                                    {transaction.recipient && (
                                                                        <>
                                                                            <span className="hidden sm:inline">•</span>
                                                                            <span className="text-sm">
                                                                                {TEXT.transactions.details.to}: {transaction.recipient}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`font-medium ${style.textColor}`}>
                                                            {style.sign}{formatCurrency(transaction.amount)}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">{TEXT.dashboard.noExpenses}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
