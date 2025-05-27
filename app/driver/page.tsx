"use client"

import { useState, useEffect } from "react"
import { MapPin, CheckCircle, Clock, Package, LogOut, User, Bell, Settings, AlertCircle, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import MockMap from "@/components/mock-map"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DriverPage() {
  const [assignments, setAssignments] = useState([])
  const [user, setUser] = useState(null)
  const [profileImage, setProfileImage] = useState("")
  const [isUpdating, setIsUpdating] = useState({})
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [showMapDialog, setShowMapDialog] = useState(false)
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

      // Charger l'image de profil
      const savedImage = localStorage.getItem(`profile_image_${parsedUser.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }

    // Détecter le mode démo et charger les assignations
    checkBackendAndFetchAssignments()
  }, [router])

  const checkBackendAndFetchAssignments = async () => {
    setIsLoading(true)

    try {
      // Test rapide de disponibilité du backend
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 secondes timeout

      const testResponse = await fetch("http://localhost:8000/", {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (testResponse.ok) {
        // Backend disponible, essayer de charger les vraies données
        await fetchAssignments()
      } else {
        // Backend indisponible, mode démo
        setIsDemoMode(true)
        loadMockAssignments()
      }
    } catch (error) {
      // Erreur réseau, mode démo automatique
      setIsDemoMode(true)
      loadMockAssignments()
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token")
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 secondes timeout

      const response = await fetch("http://localhost:8000/api/driver/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAssignments(data)
      setIsDemoMode(false)
    } catch (error) {
      console.error("Erreur lors du chargement des assignations:", error)

      // Basculer en mode démo en cas d'erreur
      setIsDemoMode(true)
      loadMockAssignments()

      toast({
        title: "Mode démo activé",
        description: "Backend non disponible - Utilisation de données de démonstration",
        duration: 3000,
      })
    }
  }

  const loadMockAssignments = () => {
    const mockAssignments = [
      {
        id: "1",
        trackingNumber: "TRK123456",
        recipient: "Jean Dupont",
        destination: "123 Rue de la Paix, 75001 Paris",
        status: "in_transit",
        weight: 2.5,
        priority: "normal",
        estimatedDelivery: "2024-01-15 14:00",
        coordinates: { lat: 48.8606, lng: 2.3376 },
        driverLocation: { lat: 48.8584, lng: 2.2945 },
      },
      {
        id: "3",
        trackingNumber: "TRK345678",
        recipient: "Pierre Durand",
        destination: "789 Boulevard Saint-Michel, 13001 Marseille",
        status: "pending",
        weight: 3.8,
        priority: "urgent",
        estimatedDelivery: "2024-01-15 10:00",
        coordinates: { lat: 43.2965, lng: 5.3698 },
        driverLocation: { lat: 43.2951, lng: 5.375 },
      },
      {
        id: "4",
        trackingNumber: "TRK901234",
        recipient: "Sophie Leblanc",
        destination: "321 Rue Victor Hugo, 31000 Toulouse",
        status: "picked_up",
        weight: 0.8,
        priority: "normal",
        estimatedDelivery: "2024-01-15 16:30",
        coordinates: { lat: 43.6047, lng: 1.4442 },
        driverLocation: { lat: 43.6, lng: 1.44 },
      },
      {
        id: "5",
        trackingNumber: "TRK567890",
        recipient: "Marie Martin",
        destination: "456 Avenue des Champs, 69000 Lyon",
        status: "in_transit",
        weight: 1.2,
        priority: "urgent",
        estimatedDelivery: "2024-01-15 11:30",
        coordinates: { lat: 45.764, lng: 4.8357 },
        driverLocation: { lat: 45.76, lng: 4.83 },
      },
    ]
    setAssignments(mockAssignments)
  }

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    // Éviter les mises à jour multiples simultanées
    if (isUpdating[deliveryId]) return

    setIsUpdating((prev) => ({ ...prev, [deliveryId]: true }))

    try {
      if (isDemoMode) {
        // Mode démo - simulation de mise à jour
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simuler un délai

        setAssignments((prev) =>
          prev.map((assignment) => (assignment.id === deliveryId ? { ...assignment, status: newStatus } : assignment)),
        )

        toast({
          title: "Statut mis à jour (Mode démo)",
          description: `Le statut a été changé vers "${getStatusText(newStatus)}" - Simulation`,
          duration: 3000,
        })
      } else {
        // Mode production - vraie API
        const token = localStorage.getItem("token")
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`http://localhost:8000/api/deliveries/${deliveryId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
        }

        // Mise à jour réussie avec le backend
        await fetchAssignments()

        toast({
          title: "Statut mis à jour",
          description: `Le statut a été changé vers "${getStatusText(newStatus)}"`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)

      // En cas d'erreur, basculer en mode démo
      if (
        error.name === "AbortError" ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("fetch") ||
        error.name === "TypeError"
      ) {
        setIsDemoMode(true)

        // Simulation de mise à jour réussie en mode démo
        setAssignments((prev) =>
          prev.map((assignment) => (assignment.id === deliveryId ? { ...assignment, status: newStatus } : assignment)),
        )

        toast({
          title: "Statut mis à jour (Mode démo)",
          description: `Le statut a été changé vers "${getStatusText(newStatus)}" - Backend non connecté`,
          duration: 3000,
        })
      } else {
        // Autres erreurs (autorisation, validation, etc.)
        toast({
          title: "Erreur",
          description: error.message || "Impossible de mettre à jour le statut",
          variant: "destructive",
          duration: 5000,
        })
      }
    } finally {
      setIsUpdating((prev) => ({ ...prev, [deliveryId]: false }))
    }
  }

  const handleQuickDelivered = (deliveryId: string) => {
    updateDeliveryStatus(deliveryId, "delivered")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const handleRetryConnection = () => {
    setIsDemoMode(false)
    checkBackendAndFetchAssignments()
  }

  const handleShowItinerary = (delivery) => {
    setSelectedDelivery(delivery)
    setShowMapDialog(true)

    toast({
      title: "Carte d'itinéraire",
      description: `Affichage de l'itinéraire vers ${delivery.recipient}`,
      duration: 3000,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500 hover:bg-amber-600"
      case "picked_up":
        return "bg-blue-500 hover:bg-blue-600"
      case "in_transit":
        return "bg-purple-500 hover:bg-purple-600"
      case "delivered":
        return "bg-emerald-500 hover:bg-emerald-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "picked_up":
        return "Récupéré"
      case "in_transit":
        return "En transit"
      case "delivered":
        return "Livré"
      default:
        return "Inconnu"
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === "urgent" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-800"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Espace Livreur
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Ahmed Livraison.e.t {isDemoMode && "• Mode Démo"}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Link href="/driver/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profileImage || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Mode Alert */}
        {isDemoMode && (
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex items-center justify-between">
              <div>
                <strong>Mode démonstration activé</strong> - Backend non disponible. Les données affichées sont
                simulées.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryConnection}
                className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Réessayer la connexion
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bonjour {user.name?.split(" ")[0]} ! 👋</h2>
          <p className="text-slate-600">Voici vos livraisons du jour {isDemoMode && "(données de démonstration)"}</p>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Livraisons du jour</CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{assignments.length}</div>
              <p className="text-xs text-slate-600">Assignées aujourd'hui</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Terminées</CardTitle>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {assignments.filter((a) => a.status === "delivered").length}
              </div>
              <p className="text-xs text-slate-600">Livrées avec succès</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">En cours</CardTitle>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {assignments.filter((a) => a.status === "in_transit" || a.status === "picked_up").length}
              </div>
              <p className="text-xs text-slate-600">À livrer</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Taux de réussite</CardTitle>
              <div className="bg-amber-100 p-2 rounded-lg">
                <User className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">98.5%</div>
              <p className="text-xs text-slate-600">Ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery List */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Mes livraisons</h3>

          {assignments.map((delivery) => (
            <Card
              key={delivery.id}
              className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg text-slate-900">{delivery.trackingNumber}</CardTitle>
                      <Badge className={getPriorityColor(delivery.priority)}>
                        {delivery.priority === "urgent" ? "Urgent" : "Normal"}
                      </Badge>
                      {isDemoMode && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Démo
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-slate-600">
                      Destinataire: <span className="font-medium">{delivery.recipient}</span>
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(delivery.status)} text-white px-3 py-1`}>
                    {getStatusText(delivery.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{delivery.destination}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Poids: {delivery.weight}kg</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Livraison prévue: {delivery.estimatedDelivery}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-700">Changer le statut:</span>
                      <Select
                        value={delivery.status}
                        onValueChange={(value) => updateDeliveryStatus(delivery.id, value)}
                        disabled={isUpdating[delivery.id]}
                      >
                        <SelectTrigger className="w-40 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="picked_up">Récupéré</SelectItem>
                          <SelectItem value="in_transit">En transit</SelectItem>
                          <SelectItem value="delivered">Livré</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200"
                        onClick={() => handleShowItinerary(delivery)}
                      >
                        <Map className="h-4 w-4 mr-2" />
                        Itinéraire
                      </Button>

                      {delivery.status !== "delivered" && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                          onClick={() => handleQuickDelivered(delivery.id)}
                          disabled={isUpdating[delivery.id]}
                        >
                          {isUpdating[delivery.id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          {isUpdating[delivery.id] ? "Mise à jour..." : "Marquer comme livré"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune livraison assignée</h3>
              <p className="text-slate-600">
                Vous n'avez pas de livraisons assignées pour le moment.
                {isDemoMode && " (Mode démonstration)"}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-blue-600" />
              <span>Itinéraire de livraison</span>
              {selectedDelivery && (
                <Badge className="ml-2" variant="outline">
                  {selectedDelivery.trackingNumber}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full">{selectedDelivery && <MockMap delivery={selectedDelivery} />}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
