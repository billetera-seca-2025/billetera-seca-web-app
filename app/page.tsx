import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ArrowRight, CreditCard, Send, Wallet} from "lucide-react"
import {TEXT, URLS} from "@/lib/constants"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{TEXT.home.title}</h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">{TEXT.home.subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href={URLS.register}>{TEXT.home.createAccount}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={URLS.login}>{TEXT.home.login}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12">
          <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <Wallet className="h-12 w-12 mb-4 text-primary mx-auto" />
              <CardTitle>{TEXT.home.accountManagement.title}</CardTitle>
              <CardDescription>{TEXT.home.accountManagement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{TEXT.home.accountManagement.content}</p>
            </CardContent>
            <CardFooter>
              <Link href={URLS.register} className="text-primary flex items-center">
                {TEXT.home.accountManagement.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-background">
            <CardHeader>
              <Send className="h-12 w-12 mb-4 text-primary mx-auto" />
              <CardTitle>{TEXT.home.p2pTransfers.title}</CardTitle>
              <CardDescription>{TEXT.home.p2pTransfers.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{TEXT.home.p2pTransfers.content}</p>
            </CardContent>
            <CardFooter>
              <Link href={URLS.register} className="text-primary flex items-center">
                {TEXT.home.p2pTransfers.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-background">
            <CardHeader>
              <CreditCard className="h-12 w-12 mb-4 text-primary mx-auto"/>
              <CardTitle>{TEXT.home.bankIntegration.title}</CardTitle>
              <CardDescription>{TEXT.home.bankIntegration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{TEXT.home.bankIntegration.content}</p>
            </CardContent>
            <CardFooter>
              <Link href={URLS.register} className="text-primary flex items-center">
                {TEXT.home.bankIntegration.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
