"use client"

import type React from "react"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {toast} from "sonner"
import {getUserBalance, addMoneyToWallet} from "@/lib/api"
import {formatCurrency} from "@/lib/utils"
import {TEXT, URLS} from "@/lib/constants"

export default function AddMoney() {
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [amount, setAmount] = useState("")

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token")
        if (!token) {
            router.push(URLS.login)
            return
        }

        const fetchBalance = async () => {
            try {
                const balanceData = await getUserBalance()
                setBalance(balanceData.balance)
            } catch (error) {
                console.error("Error fetching balance:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBalance()
    }, [router])

    const handleSubmit = async (e: React.FormEvent, method: string) => {
        e.preventDefault()

        const amountValue = Number.parseFloat(amount)

        if (isNaN(amountValue) || amountValue <= 0) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.invalidAmount,
            })
            return
        }

        setIsAdding(true)

        try {
            await addMoneyToWallet(amountValue, method)

            toast(TEXT.addMoney.success, {
                description: TEXT.addMoney.successMessage.replace("{amount}", formatCurrency(amountValue)),
            })

            // Reset form
            setAmount("")

            // Update balance
            const balanceData = await getUserBalance()
            setBalance(balanceData.balance)
        } catch (error) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.addMoney.error,
            })
        } finally {
            setIsAdding(false)
        }
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">{TEXT.addMoney.title}</h1>
                    <p className="text-muted-foreground">{TEXT.addMoney.subtitle}</p>
                </div>
                <Button onClick={() => router.push(URLS.dashboard)} variant="outline" className="mt-4 md:mt-0">
                    {TEXT.common.backToDashboard}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                    <Tabs defaultValue="card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{TEXT.addMoney.addFunds}</CardTitle>
                                    <CardDescription>{TEXT.addMoney.addFundsDescription}</CardDescription>
                                </div>
                                <TabsList>
                                    <TabsTrigger value="card">{TEXT.addMoney.tabs.card}</TabsTrigger>
                                    <TabsTrigger value="bank">{TEXT.addMoney.tabs.bank}</TabsTrigger>
                                </TabsList>
                            </div>
                        </CardHeader>

                        <TabsContent value="card">
                            <form onSubmit={(e) => handleSubmit(e, "card")}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">{TEXT.addMoney.form.cardNumber}</Label>
                                        <Input id="card-number" placeholder="1234 5678 9012 3456" required/>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">{TEXT.addMoney.form.expiryDate}</Label>
                                            <Input id="expiry" placeholder="MM/AA" required/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">{TEXT.addMoney.form.cvv}</Label>
                                            <Input id="cvv" placeholder="123" required/>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="card-amount">{TEXT.addMoney.form.amount}</Label>
                                        <Input
                                            id="card-amount"
                                            type="number"
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isAdding}>
                                        {isAdding ? TEXT.addMoney.form.buttonLoading : TEXT.addMoney.form.buttonCard}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>

                        <TabsContent value="bank">
                            <form onSubmit={(e) => handleSubmit(e, "bank")}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bank-name">{TEXT.addMoney.form.bankName}</Label>
                                        <Input id="bank-name" placeholder="Nombre del banco" required/>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="account-number">{TEXT.addMoney.form.accountNumber}</Label>
                                        <Input id="account-number" placeholder="Número de cuenta bancaria" required/>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bank-amount">{TEXT.addMoney.form.amount}</Label>
                                        <Input
                                            id="bank-amount"
                                            type="number"
                                            placeholder="0.00"
                                            min="0.01"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isAdding}>
                                        {isAdding ? TEXT.addMoney.form.buttonLoading : TEXT.addMoney.form.buttonBank}
                                    </Button>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>

                <Card
                    className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
                    <CardHeader>
                        <CardTitle>{TEXT.common.currentBalance}</CardTitle>
                        <CardDescription>{TEXT.common.yourCurrentBalance}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <a href={URLS.dashboard}>{TEXT.common.seeTransactions}</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
