import React from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import Link from "next/link"
import {ArrowRight} from "lucide-react";

interface FeatureCardProps {
    Icon: React.ElementType;
    title: string;
    description: string;
    content: string;
    cta: string;
    href: string;
}

export function FeatureCard({Icon, title, description, content, cta, href}: FeatureCardProps) {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
                <Icon className="h-12 w-12 mb-4 text-primary mx-auto"/>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{content}</p>
            </CardContent>
            <CardFooter>
                <Link href={href} className="text-primary flex items-center">
                    {cta} <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
            </CardFooter>
        </Card>
    )
}