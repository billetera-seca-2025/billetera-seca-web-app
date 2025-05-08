"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ArrowDownIcon, ArrowUpIcon, Search} from "lucide-react"
import {getAllTransactions} from "@/lib/api"
import {formatCurrency} from "@/lib/utils"
import type {Transaction} from "@/types/wallet"
import {TEXT, URLS} from "@/lib/constants"

export default function Transactions() {
    const router = useRouter()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token")
        if (!token) {
            router.push(URLS.login)
            return
        }

        const fetchData = async () => {
            try {
                const transactionsData = await getAllTransactions()
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
            result = result.filter((t) => t.type === filter)
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (t) =>
                    t.description.toLowerCase().includes(query) ||
                    t.recipient?.toLowerCase().includes(query) ||
                    t.sender?.toLowerCase().includes(query),
            )
        }

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
                        <SelectItem value="expense">{TEXT.transactions.filterOptions.expense}</SelectItem>
                        <SelectItem value="transfer">{TEXT.transactions.filterOptions.transfer}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Transacciones</CardTitle>
                    <CardDescription>
                        {filteredTransactions.length} {TEXT.transactions.transactionsFound}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id}
                                     className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-2 rounded-full ${
                                                transaction.type === "income"
                                                    ? "bg-green-100"
                                                    : transaction.type === "expense"
                                                        ? "bg-red-100"
                                                        : "bg-blue-100"
                                            }`}
                                        >
                                            {transaction.type === "income" ? (
                                                <ArrowDownIcon className="h-5 w-5 text-green-600"/>
                                            ) : (
                                                <ArrowUpIcon className="h-5 w-5 text-red-600"/>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{transaction.description}</p>
                                            <div
                                                className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                                {transaction.recipient && <span className="hidden sm:inline">•</span>}
                                                {transaction.recipient && (
                                                    <span>
                            {TEXT.transactions.details.to}: {transaction.recipient}
                          </span>
                                                )}
                                                {transaction.sender && <span className="hidden sm:inline">•</span>}
                                                {transaction.sender && (
                                                    <span>
                            {TEXT.transactions.details.from}: {transaction.sender}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`font-medium ${
                                            transaction.type === "income"
                                                ? "text-green-600"
                                                : transaction.type === "expense"
                                                    ? "text-red-600"
                                                    : "text-blue-600"
                                        }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
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
