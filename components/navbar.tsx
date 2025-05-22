"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {Button} from "@/components/ui/button"
import {LogOut, Menu, Wallet} from "lucide-react"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {useEffect, useState} from "react"
import {cn} from "@/lib/utils"
import {TEXT, URLS} from "@/lib/constants"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
    const pathname = usePathname()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState("")

    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem("user")
        if (user) {
            const userData = JSON.parse(user)
            setIsLoggedIn(true)
            setUserName(userData.email?.split("@")[0] || "Usuario")
        }
    }, [pathname])

    const handleLogout = () => {
        // Remove from both localStorage and cookies
        localStorage.removeItem("user")
        localStorage.removeItem("credentials")
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        setIsLoggedIn(false)
        window.location.href = URLS.home
    }

    const navItems = [
        {name: TEXT.navbar.home, href: URLS.home},
        ...(isLoggedIn
            ? [
                {name: TEXT.navbar.dashboard, href: URLS.dashboard},
                {name: TEXT.navbar.transactions, href: URLS.transactions},
                {name: TEXT.navbar.transfer, href: URLS.transfer},
            ]
            : []),
    ]

    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 mr-4">
                    <Link href={URLS.home} className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-primary"/>
                        <span className="text-xl font-bold">{TEXT.common.appName}</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground",
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-4">
                            <Link href={URLS.dashboard}>
                                <Avatar>
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {userName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2"/>
                                {TEXT.navbar.logout}
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Button asChild variant="ghost" size="sm">
                                <Link href={URLS.login}>{TEXT.navbar.login}</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={URLS.register}>{TEXT.navbar.register}</Link>
                            </Button>
                        </div>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-4">
                                <nav className="flex flex-col gap-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "text-sm font-medium transition-colors hover:text-primary",
                                                pathname === item.href ? "text-primary" : "text-muted-foreground",
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Tema</span>
                                        <ThemeToggle />
                                    </div>
                                </nav>
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-2 pt-4">
                                            <Avatar>
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {userName.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{userName}</span>
                                        </div>
                                        <Button variant="outline" onClick={handleLogout}>
                                            <LogOut className="h-4 w-4 mr-2"/>
                                            {TEXT.navbar.logout}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2 pt-4">
                                        <Button asChild variant="outline">
                                            <Link href={URLS.login}>{TEXT.navbar.login}</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={URLS.register}>{TEXT.navbar.register}</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
