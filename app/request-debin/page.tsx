"use client"

import type React from "react"

import {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from "sonner"
import {getUserBalance, requestDebin} from "@/lib/api"
import {formatCurrency} from "@/lib/utils"
import {TEXT, URLS} from "@/lib/constants"

export default function RequestDebin() {
    const router = useRouter()
    const [balance, setBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isRequesting, setIsRequesting] = useState(false)
    const [userEmail, setUserEmail] = useState<string>("")
    const [debinData, setDebinData] = useState({
        bankName: "",
        accountNumber: "",
        amount: "",
    })

    useEffect(() => {
        // Check if user is logged in from cookies
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='))
        if (!userCookie) {
            router.push(URLS.login)
            return
        }

        try {
            const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
            if (!userData.email) {
                throw new Error("User email not found")
            }
            setUserEmail(userData.email)
        } catch (error) {
            console.error("Error parsing user data:", error)
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setDebinData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userEmail) {
            toast.error(TEXT.common.errorOccurred, {
                description: "No se pudo obtener el email del usuario. Por favor, vuelve a iniciar sesión.",
            })
            router.push(URLS.login)
            return
        }

        const amount = Number.parseFloat(debinData.amount)

        if (isNaN(amount) || amount <= 0) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.transfer.errors.invalidAmount,
            })
            return
        }

        setIsRequesting(true)

        try {
            await requestDebin(debinData.bankName, debinData.accountNumber, amount)

            toast.success(TEXT.requestDebin.success, {
                description: `Se solicitó un DEBIN por ${formatCurrency(amount)} al banco ${debinData.bankName}.`,
            })

            // Reset form
            setDebinData({
                bankName: "",
                accountNumber: "",
                amount: "",
            })

            // Update balance
            const balanceData = await getUserBalance()
            setBalance(balanceData.balance)
        } catch (error) {
            // Log detallado del error
            console.error('Error completo:', error)
            if (error instanceof Error) {
                console.error('Error message:', error.message)
                console.error('Error stack:', error.stack)
            }
            
            // Asegurarnos de que el mensaje de error sea una cadena
            const errorMessage = error instanceof Error 
                ? error.message 
                : typeof error === 'string' 
                    ? error 
                    : TEXT.requestDebin.error
            
            console.log('Mensaje de error a mostrar:', errorMessage)
            
            // Mostrar el mensaje de error en el toast
            toast.error(errorMessage)
        } finally {
            setIsRequesting(false)
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
                    <h1 className="text-3xl font-bold tracking-tight">{TEXT.requestDebin.title}</h1>
                    <p className="text-muted-foreground">{TEXT.requestDebin.subtitle}</p>
                </div>
                <Button onClick={() => router.push(URLS.dashboard)} variant="outline" className="mt-4 md:mt-0">
                    {TEXT.common.backToDashboard}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>{TEXT.requestDebin.requestDebin}</CardTitle>
                        <CardDescription>{TEXT.requestDebin.requestDebinDescription}</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bankName">{TEXT.requestDebin.form.bankName}</Label>
                                <Input
                                    id="bankName"
                                    name="bankName"
                                    placeholder="Nombre del banco"
                                    value={debinData.bankName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">{TEXT.requestDebin.form.accountNumber}</Label>
                                <Input
                                    id="accountNumber"
                                    name="accountNumber"
                                    placeholder="Número de cuenta bancaria"
                                    value={debinData.accountNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">{TEXT.requestDebin.form.amount}</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    value={debinData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isRequesting}>
                                {isRequesting ? TEXT.requestDebin.form.buttonLoading : TEXT.requestDebin.form.button}
                            </Button>
                        </CardFooter>
                    </form>
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
