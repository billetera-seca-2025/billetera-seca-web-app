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
import {getUserBalance, transferMoney} from "@/lib/api"
import {formatCurrency} from "@/lib/utils"
import {TEXT, URLS} from "@/lib/constants"

export default function Transfer() {
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [transferData, setTransferData] = useState({
        recipient: "",
        amount: "",
        description: "",
    })

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

        fetchBalance().then()
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setTransferData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const amount = Number.parseFloat(transferData.amount)

        if (isNaN(amount) || amount <= 0) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.invalidAmount,
            })
            return
        }

        if (amount > balance) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.insufficientFunds,
            })
            return
        }

        if (!transferData.recipient) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.noRecipient,
            })
            return
        }

        setIsSending(true)

        try {
            await transferMoney(transferData.recipient, amount, transferData.description || "Transferencia")

            toast(TEXT.transfer.success, {
                description: TEXT.transfer.successMessage
                    .replace("{amount}", formatCurrency(amount))
                    .replace("{recipient}", transferData.recipient),
            })

            // Reset form
            setTransferData({
                recipient: "",
                amount: "",
                description: "",
            })

            // Update balance
            const balanceData = await getUserBalance()
            setBalance(balanceData.balance)
        } catch (error) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.transferFailed,
            })
        } finally {
            setIsSending(false)
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
                    <h1 className="text-3xl font-bold tracking-tight">{TEXT.transfer.title}</h1>
                    <p className="text-muted-foreground">{TEXT.transfer.subtitle}</p>
                </div>
                <Button onClick={() => router.push(URLS.dashboard)} variant="outline" className="mt-4 md:mt-0">
                    {TEXT.common.backToDashboard}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                    <Tabs defaultValue="email">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{TEXT.transfer.sendMoney}</CardTitle>
                                    <CardDescription>{TEXT.transfer.sendMoneyDescription}</CardDescription>
                                </div>
                                <TabsList>
                                    <TabsTrigger value="email">{TEXT.transfer.tabs.email}</TabsTrigger>
                                    <TabsTrigger value="id">{TEXT.transfer.tabs.id}</TabsTrigger>
                                </TabsList>
                            </div>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <TabsContent value="email" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient">{TEXT.transfer.form.recipientEmail}</Label>
                                        <Input
                                            id="recipient"
                                            name="recipient"
                                            type="email"
                                            placeholder="usuario@ejemplo.com"
                                            value={transferData.recipient}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="id" className="space-y-4 mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient">{TEXT.transfer.form.recipientId}</Label>
                                        <Input
                                            id="recipient"
                                            name="recipient"
                                            placeholder="ID único del usuario"
                                            value={transferData.recipient}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </TabsContent>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">{TEXT.transfer.form.amount}</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        placeholder="0.00"
                                        min="0.01"
                                        step="0.01"
                                        value={transferData.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">{TEXT.transfer.form.description}</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder={TEXT.transfer.form.descriptionPlaceholder}
                                        value={transferData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isSending}>
                                    {isSending ? TEXT.transfer.form.buttonLoading : TEXT.transfer.form.button}
                                </Button>
                            </CardFooter>
                        </form>
                    </Tabs>
                </Card>

                <Card
                    className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
                    <CardHeader>
                        <CardTitle>{TEXT.common.availableBalance}</CardTitle>
                        <CardDescription>{TEXT.common.yourCurrentBalance}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <a href={URLS.addMoney}>{TEXT.dashboard.actions.add}</a>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
