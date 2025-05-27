"use client"

import { useState, useEffect } from "react"
import { Truck, Menu, X, Bell, LogOut, Settings, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [profileImage, setProfileImage] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Charger l'image de profil
      const savedImage = localStorage.getItem(`profile_image_${parsedUser.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/tracking", label: "Suivi" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Ahmed Livraison.e.t
              </h1>
              <p className="text-xs text-slate-500 font-medium">Logistics Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                  pathname === item.href ? "text-blue-600" : "text-slate-600"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profileImage || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/driver" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Mes livraisons</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/driver/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Mon profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Devenir livreur
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-slate-200/50">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {!user && (
                <div className="pt-4 border-t border-slate-200">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                      Devenir livreur
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
