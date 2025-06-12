"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ArrowDownIcon, ArrowUpIcon, Search} from "lucide-react"
import {getAllTransactions} from "@/lib/api"
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

export default function Transactions() {
    const router = useRouter()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Check if user is logged in from cookies
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='))
        if (!userCookie) {
            router.push(URLS.login)
            return
        }

        const fetchData = async () => {
            try {
                const transactionsData = await getAllTransactions()
                console.log('Raw transactions data received:', transactionsData.map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: t.amount,
                    description: t.description,
                    sender: t.sender,
                    recipient: t.recipient,
                    date: t.date,
                    relatedWalletId: t.relatedWalletId,
                    relatedBankName: t.relatedBankName
                })))
                setTransactions(transactionsData)
                setFilteredTransactions(transactionsData)
            } catch (error) {
                console.error("Error fetching transactions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [router])

    useEffect(() => {
        let result = transactions

        // Apply type filter
        if (filter !== "all") {
            result = result.filter((t) => {
                console.log('Filtering transaction:', {
                    id: t.id,
                    type: t.type,
                    filter: filter,
                    matches: t.type === filter
                })
                switch (filter) {
                    case "income":
                        return t.type === "income"
                    case "outcome":
                        return t.type === "expense"
                    default:
                        return true
                }
            })
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (t) => {
                    const description = t.description || getTransactionDescription(t)
                    const matches = description.toLowerCase().includes(query) ||
                        t.recipient?.toLowerCase().includes(query) ||
                        t.sender?.toLowerCase().includes(query)
                    console.log('Searching transaction:', {
                        id: t.id,
                        description,
                        recipient: t.recipient,
                        sender: t.sender,
                        query,
                        matches
                    })
                    return matches
                }
            )
        }

        console.log('Filtered transactions:', result.map(t => ({
            id: t.id,
            type: t.type,
            description: t.description,
            sender: t.sender,
            recipient: t.recipient
        })))
        setFilteredTransactions(result)
    }, [filter, searchQuery, transactions])

    if (isLoading) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <p>{TEXT.common.loading}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{TEXT.transactions.title}</h1>
                    <p className="text-muted-foreground">{TEXT.transactions.subtitle}</p>
                </div>
                <Button onClick={() => router.push(URLS.dashboard)} variant="outline" className="mt-4 md:mt-0">
                    {TEXT.common.backToDashboard}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder={TEXT.transactions.searchPlaceholder}
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder={TEXT.transactions.filterByType}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{TEXT.transactions.filterOptions.all}</SelectItem>
                        <SelectItem value="income">{TEXT.transactions.filterOptions.income}</SelectItem>
                        <SelectItem value="outcome">{TEXT.transactions.filterOptions.expense}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{TEXT.transactions.title}</CardTitle>
                    <CardDescription>
                        {filteredTransactions.length} {TEXT.transactions.transactionsFound}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => {
                                console.log('Rendering transaction:', {
                                    id: transaction.id,
                                    type: transaction.type,
                                    description: transaction.description,
                                    sender: transaction.sender,
                                    recipient: transaction.recipient,
                                    amount: transaction.amount
                                })
                                
                                const style = getTransactionStyle(transaction.type)
                                const description = getTransactionDescription(transaction)
                                return (
                                    <div 
                                        key={`${transaction.id}-${transaction.date}`}
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
                            <p className="text-muted-foreground">{TEXT.transactions.noTransactionsFound}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}