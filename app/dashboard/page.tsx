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
import {formatCurrency} from "@/lib/utils"
import type {Transaction} from "@/types/wallet"
import {TEXT, URLS} from "@/lib/constants"

export default function Dashboard() {
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Check if user is logged in from cookies
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='))
        if (!userCookie) {
            router.push(URLS.login)
            return
        }

        const fetchData = async () => {
            try {
                const balanceData = await getUserBalance()
                setBalance(balanceData.balance)

                const transactionsData = await getRecentTransactions()
                setTransactions(transactionsData)
            } catch (error) {
                console.error("Error fetching data:", error)
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

                    <TabsContent value="recent" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{TEXT.dashboard.recentTransactions}</CardTitle>
                                <CardDescription>{TEXT.dashboard.recentTransactionsDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                                                    >
                                                        {transaction.type === "income" ? (
                                                            <ArrowDownIcon className="h-5 w-5 text-green-600"/>
                                                        ) : (
                                                            <ArrowUpIcon className="h-5 w-5 text-red-600"/>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{transaction.description}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(transaction.date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                                                >
                                                    {transaction.type === "income" ? "+" : "-"}
                                                    {formatCurrency(transaction.amount)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-muted-foreground">{TEXT.dashboard.noTransactions}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="income" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{TEXT.dashboard.tabs.income}</CardTitle>
                                <CardDescription>{TEXT.transactions.filterOptions.income}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.filter((t) => t.type === "income").length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions
                                            .filter((t) => t.type === "income")
                                            .map((transaction) => (
                                                <div key={transaction.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-full bg-green-100">
                                                            <ArrowDownIcon className="h-5 w-5 text-green-600"/>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{transaction.description}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(transaction.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="font-medium text-green-600">+{formatCurrency(transaction.amount)}</div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-muted-foreground">{TEXT.dashboard.noIncome}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="expenses" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{TEXT.dashboard.tabs.expenses}</CardTitle>
                                <CardDescription>{TEXT.transactions.filterOptions.expense}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.filter((t) => t.type === "expense").length > 0 ? (
                                    <div className="space-y-4">
                                        {transactions
                                            .filter((t) => t.type === "expense")
                                            .map((transaction) => (
                                                <div key={transaction.id} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-full bg-red-100">
                                                            <ArrowUpIcon className="h-5 w-5 text-red-600"/>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{transaction.description}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(transaction.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="font-medium text-red-600">-{formatCurrency(transaction.amount)}</div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-muted-foreground">{TEXT.dashboard.noExpenses}</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
