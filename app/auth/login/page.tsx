"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Truck, Mail, Lock, ArrowRight, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Afficher le message de succès si venant de l'inscription
    const message = searchParams.get("message")
    if (message) {
      setSuccess(message)
    }

    // Détecter automatiquement le mode démo
    checkBackendAvailability()
  }, [searchParams])

  const checkBackendAvailability = async () => {
    try {
      const response = await fetch("http://localhost:8000/", {
        method: "GET",
        signal: AbortSignal.timeout(3000), // Timeout de 3 secondes
      })
      setIsDemoMode(!response.ok)
    } catch (error) {
      setIsDemoMode(true)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation côté client
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide")
      setIsLoading(false)
      return
    }

    // Mode démo automatique si backend non disponible
    if (isDemoMode) {
      handleDemoLogin()
      return
    }

    try {
      // Tentative de connexion au backend avec timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 secondes timeout

      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Erreur de connexion: ${response.status}`)
      }

      const data = await response.json()

      // Stocker le token JWT et les informations utilisateur
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setSuccess("Connexion réussie ! Redirection...")

      // Rediriger vers le dashboard livreur
      setTimeout(() => {
        router.push("/driver")
      }, 1500)
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)

      // Basculer automatiquement en mode démo
      if (
        error.name === "AbortError" ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("fetch") ||
        error.name === "TypeError" ||
        error.message.includes("NetworkError")
      ) {
        setIsDemoMode(true)
        handleDemoLogin()
      } else {
        // Autres erreurs (mauvais identifiants, etc.)
        setError(error.message || "Erreur de connexion")
        setIsLoading(false)
      }
    }
  }

  const handleDemoLogin = () => {
    // Vérification des identifiants de démo
    const validDemoCredentials = [
      { email: "demo@livreur.com", password: "demo123" },
      { email: "test@test.com", password: "123456" },
      { email: "admin@admin.com", password: "admin" },
    ]

    const isValidDemo =
      validDemoCredentials.some((cred) => cred.email === email && cred.password === password) ||
      (email.includes("@") && password.length >= 6)

    if (isValidDemo) {
      // Simulation de connexion réussie pour la démo
      const demoUser = {
        id: 1,
        email: email,
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        role: "driver",
      }

      localStorage.setItem("token", "demo-token-" + Date.now())
      localStorage.setItem("user", JSON.stringify(demoUser))

      setSuccess("Connexion réussie ! (Mode démo - backend non connecté)")

      setTimeout(() => {
        router.push("/driver")
      }, 1500)
    } else {
      setError("Identifiants incorrects. En mode démo, utilisez: demo@livreur.com / demo123")
    }

    setIsLoading(false)
  }

  const handleQuickDemo = () => {
    setEmail("demo@livreur.com")
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                DeliveryTracker Pro
              </h1>
              <p className="text-xs text-slate-500 font-medium">Espace Livreur</p>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Connexion</h2>
          <p className="text-slate-600">Accédez à votre espace livreur</p>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mode démonstration activé</strong> - Le backend n'est pas disponible. Vous pouvez tester
              l'application avec des identifiants de démo.
            </AlertDescription>
          </Alert>
        )}

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-center text-xl">Connexion sécurisée</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Se connecter</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              {/* Quick Demo Button */}
              {isDemoMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleQuickDemo}
                  className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Connexion démo rapide
                </Button>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">
                {isDemoMode ? "Mode démonstration actif :" : "Mode démonstration :"}
              </p>
              <p className="text-xs text-blue-700 mb-1">
                <strong>Identifiants de test :</strong>
              </p>
              <p className="text-xs text-blue-700 mb-1">• demo@livreur.com / demo123</p>
              <p className="text-xs text-blue-700 mb-1">• test@test.com / 123456</p>
              <p className="text-xs text-blue-700 mb-1">• admin@admin.com / admin</p>
              <p className="text-xs text-blue-700">• Ou n'importe quel email valide avec mot de passe 6+ caractères</p>
              {isDemoMode && (
                <p className="text-xs text-blue-800 font-medium mt-2">
                  ⚡ Backend non disponible - Fonctionnement en mode démo automatique
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              conditions d'utilisation
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
