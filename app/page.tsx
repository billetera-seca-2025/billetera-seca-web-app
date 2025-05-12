import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ArrowRight, CreditCard, Send, Wallet} from "lucide-react"
import {TEXT, URLS} from "@/lib/constants"
import {FeatureCard} from "@/components/feature-card";

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

                    <FeatureCard
                        Icon={Wallet}
                        title={TEXT.home.accountManagement.title}
                        description={TEXT.home.accountManagement.description}
                        content={TEXT.home.accountManagement.content}
                        cta={TEXT.home.accountManagement.cta}
                        href={URLS.register}
                    />

                    <FeatureCard
                        Icon={Send}
                        title={TEXT.home.p2pTransfers.title}
                        description={TEXT.home.p2pTransfers.description}
                        content={TEXT.home.p2pTransfers.content}
                        cta={TEXT.home.p2pTransfers.cta}
                        href={URLS.register}
                    />

                    <FeatureCard
                        Icon={CreditCard}
                        title={TEXT.home.bankIntegration.title}
                        description={TEXT.home.bankIntegration.description}
                        content={TEXT.home.bankIntegration.content}
                        cta={TEXT.home.bankIntegration.cta}
                        href={URLS.register}
                    />
                </div>
            </div>
        </div>
    )
}
