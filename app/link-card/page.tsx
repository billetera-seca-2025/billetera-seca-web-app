"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CreditCard } from "lucide-react"
import {TEXT, URLS} from "@/lib/constants"

export default function LinkCard() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulación de vinculación de tarjeta
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast(TEXT.linkCard.success, {
        description: TEXT.linkCard.successMessage,
      })

      // Redireccionar al dashboard
      router.push(URLS.dashboard)
    } catch (error) {
      toast.error(TEXT.common.errorOccurred, {
        description: TEXT.linkCard.error,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{TEXT.linkCard.title}</h1>
          <p className="text-muted-foreground">{TEXT.linkCard.subtitle}</p>
        </div>
        <Button onClick={() => router.push(URLS.dashboard)} variant="outline" className="mt-4 md:mt-0">
          {TEXT.common.backToDashboard}
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle>{TEXT.linkCard.newCard}</CardTitle>
            </div>
            <CardDescription>{TEXT.linkCard.newCardDescription}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{TEXT.linkCard.form.cardNumber}</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">{TEXT.linkCard.form.cardHolder}</Label>
                <Input
                  id="cardHolder"
                  name="cardHolder"
                  placeholder={TEXT.linkCard.form.cardHolderPlaceholder}
                  value={cardData.cardHolder}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">{TEXT.linkCard.form.expiryDate}</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={cardData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">{TEXT.linkCard.form.cvv}</Label>
                  <Input id="cvv" name="cvv" placeholder="123" value={cardData.cvv} onChange={handleChange} required />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? TEXT.linkCard.form.buttonLoading : TEXT.linkCard.form.button}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
