"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Truck, Mail, Lock, User, Phone, ArrowRight, Shield, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(true) // Par défaut en mode démo
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      setIsLoading(false)
      return
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide")
      setIsLoading(false)
      return
    }

    // Validation des champs obligatoires
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Veuillez remplir tous les champs obligatoires")
      setIsLoading(false)
      return
    }

    try {
      // Utiliser l'URL de l'API depuis la configuration ou une URL relative
      const apiUrl = "/api/auth/register" // Utilise le proxy API de Next.js
      
      // Données à envoyer
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }
      
      // Appel API simple sans AbortController
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        setError(`Erreur d'inscription (${response.status}). Veuillez réessayer.`)
        setIsLoading(false)
        return
      }
      
      setSuccess("Compte créé avec succès ! Redirection vers la connexion...")
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push("/auth/login?message=Compte créé avec succès")
      }, 2000)
      
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error)
      
      // Vérifier si c'est une erreur de réseau
      if (
        error.name === "TypeError" || 
        (error.message && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")))
      ) {
        // En cas d'erreur de connexion, passer en mode démo
        setIsDemoMode(true)
        setSuccess("Compte créé avec succès ! (Mode démo - backend non connecté)")

        // Simuler un délai puis rediriger
        setTimeout(() => {
          router.push("/auth/login?message=Compte créé avec succès (Mode démo)")
        }, 2000)
      } else {
        // Autres erreurs (validation, email déjà utilisé, etc.)
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Erreur lors de la création du compte"
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
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
              <p className="text-xs text-slate-500 font-medium">Devenir Livreur</p>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Créer un compte</h2>
          <p className="text-slate-600">Rejoignez notre équipe de livreurs</p>
        </div>

        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mode démonstration</strong> - L'inscription fonctionne même sans backend connecté.
            </AlertDescription>
          </Alert>
        )}

        {/* Register Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl mx-auto mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-center text-xl">Inscription livreur</CardTitle>
            <CardDescription className="text-center">Créez votre compte pour commencer à livrer</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-700 font-medium">
                    Prénom *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-700 font-medium">
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Adresse email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Téléphone *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Minimum 6 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                  Confirmer le mot de passe *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)} 
                  className="mt-1" 
                />
                <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Créer mon compte</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Demo info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Mode démonstration :</p>
              <p className="text-xs text-blue-700 mb-1">L'inscription fonctionne même sans backend connecté.</p>
              <p className="text-xs text-blue-700">Remplissez le formulaire avec des données valides pour tester.</p>
              {isDemoMode && (
                <p className="text-xs text-blue-800 font-medium mt-2">
                  ⚡ Backend non disponible - Fonctionnement en mode démo automatique
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
