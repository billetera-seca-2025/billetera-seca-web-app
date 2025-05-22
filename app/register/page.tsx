"use client"

import type React from "react"

import {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {toast} from "sonner"
import {registerUser} from "@/lib/api"
import {TEXT, URLS} from "@/lib/constants"

export default function Register() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error(TEXT.common.errorOccurred, {
                description: TEXT.auth.register.errorPasswordMatch,
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await registerUser(formData.email, formData.password)

            // Store user data in both localStorage and cookies
            const userData = JSON.stringify(response.user)
            localStorage.setItem("user", userData)
            // Set cookie with expiration of 7 days
            const expirationDate = new Date()
            expirationDate.setDate(expirationDate.getDate() + 7)
            document.cookie = `user=${userData}; path=/; expires=${expirationDate.toUTCString()}`
            
            // Store credentials for future API calls (only in localStorage)
            localStorage.setItem("credentials", JSON.stringify({
                email: formData.email,
                password: formData.password
            }))

            toast(TEXT.auth.register.success, {
                description: response.message,
            })

            // Redirect to dashboard
            router.push(URLS.dashboard)
        } catch (error) {
            toast.error(TEXT.common.errorOccurred, {
                description: error instanceof Error ? error.message : TEXT.auth.register.errorCreation,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
            <Card
                className="w-full max-w-md shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{TEXT.auth.register.title}</CardTitle>
                    <CardDescription>{TEXT.auth.register.description}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{TEXT.auth.register.email}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@ejemplo.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{TEXT.auth.register.password}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{TEXT.auth.register.confirmPassword}</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? TEXT.auth.register.buttonLoading : TEXT.auth.register.button}
                        </Button>
                        <div className="text-center text-sm">
                            {TEXT.auth.register.alreadyHaveAccount}{" "}
                            <Link href={URLS.login} className="text-primary underline">
                                {TEXT.auth.register.loginLink}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
