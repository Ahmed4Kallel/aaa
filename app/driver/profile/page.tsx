"use client"

import { useState, useEffect, useRef } from "react"
import { User, Mail, Phone, Camera, Save, ArrowLeft, Edit, Upload, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [profileImage, setProfileImage] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/auth/login")
      return
    }

    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Initialiser le formulaire avec les données utilisateur
      const nameParts = parsedUser.name?.split(" ") || ["", ""]
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "06 12 34 56 78",
      })

      // Charger l'image de profil depuis le localStorage
      const savedImage = localStorage.getItem(`profile_image_${parsedUser.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }

    // Détecter le mode démo
    checkBackendAvailability()
  }, [router])

  const checkBackendAvailability = async () => {
    try {
      const response = await fetch("http://localhost:8000/", {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      })
      setIsDemoMode(!response.ok)
    } catch (error) {
      setIsDemoMode(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis"
    } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Format de téléphone invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image valide",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target.result
        setProfileImage(imageDataUrl)

        // Sauvegarder immédiatement l'image dans le localStorage
        if (user) {
          localStorage.setItem(`profile_image_${user.id}`, imageDataUrl)

          // Mettre à jour aussi l'utilisateur avec la nouvelle image
          const updatedUser = { ...user, profileImage: imageDataUrl }
          setUser(updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }

        toast({
          title: "Image mise à jour",
          description: "Votre photo de profil a été modifiée avec succès",
          duration: 3000,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage("")
    if (user) {
      localStorage.removeItem(`profile_image_${user.id}`)

      // Mettre à jour l'utilisateur
      const updatedUser = { ...user, profileImage: "" }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
    toast({
      title: "Image supprimée",
      description: "Votre photo de profil a été supprimée",
      duration: 3000,
    })
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)

    try {
      if (isDemoMode) {
        // Mode démo - simulation de sauvegarde
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mettre à jour les données utilisateur avec l'image
        const updatedUser = {
          ...user,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          profileImage: profileImage, // Conserver l'image
        }

        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // S'assurer que l'image est bien sauvegardée
        if (profileImage) {
          localStorage.setItem(`profile_image_${user.id}`, profileImage)
        }

        toast({
          title: "Profil mis à jour (Mode démo)",
          description: "Vos informations ont été sauvegardées localement",
          duration: 3000,
        })
      } else {
        // Mode production - vraie API
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          }),
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du profil")
        }

        const updatedUser = await response.json()
        updatedUser.profileImage = profileImage // Ajouter l'image
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))

        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées avec succès",
          duration: 3000,
        })
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Restaurer les données originales
    if (user) {
      const nameParts = user.name?.split(" ") || ["", ""]
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "06 12 34 56 78",
      })

      // Restaurer l'image originale
      const savedImage = localStorage.getItem(`profile_image_${user.id}`)
      setProfileImage(savedImage || "")
    }
    setErrors({})
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/driver">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Mon Profil</h1>
                <p className="text-xs text-slate-500">
                  Gérez vos informations personnelles {isDemoMode && "• Mode Démo"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mode démonstration</strong> - Les modifications sont sauvegardées localement.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle>Photo de profil</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={profileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>

                    {profileImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Supprimer la photo
                      </Button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <p className="text-xs text-slate-500">JPG, PNG ou GIF. Max 5MB.</p>
                  </div>
                )}

                {/* Affichage permanent de l'image même en mode non-édition */}
                {!isEditing && profileImage && <p className="text-xs text-slate-500">Photo de profil personnalisée</p>}
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informations personnelles</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      Prénom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 h-12 ${
                          isEditing ? "border-slate-200 focus:border-blue-500" : "bg-slate-50 border-slate-200"
                        } ${errors.firstName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      Nom *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing}
                      className={`h-12 ${
                        isEditing ? "border-slate-200 focus:border-blue-500" : "bg-slate-50 border-slate-200"
                      } ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
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
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={!isEditing}
                      className={`pl-10 h-12 ${
                        isEditing ? "border-slate-200 focus:border-blue-500" : "bg-slate-50 border-slate-200"
                      } ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Numéro de téléphone *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className={`pl-10 h-12 ${
                        isEditing ? "border-slate-200 focus:border-blue-500" : "bg-slate-50 border-slate-200"
                      } ${errors.phone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Additional Info */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Informations du compte</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">ID Livreur:</span>
                      <span className="ml-2 font-medium">#{user.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Rôle:</span>
                      <span className="ml-2 font-medium capitalize">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Statut:</span>
                      <span className="ml-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          Actif
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Membre depuis:</span>
                      <span className="ml-2 font-medium">Janvier 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
