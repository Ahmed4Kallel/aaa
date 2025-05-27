"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Zap,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MockMap from "@/components/mock-map"
import Link from "next/link"

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDelivery, setCurrentDelivery] = useState(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [backendStatus, setBackendStatus] = useState("checking") // checking, available, unavailable

  useEffect(() => {
    // Simulation d'une livraison en cours pour la démo de la carte
    setCurrentDelivery({
      id: "1",
      trackingNumber: "TRK123456",
      recipient: "Jean Dupont",
      destination: "123 Rue de la Paix, 75001 Paris",
      status: "in_transit",
      currentLocation: "En route vers Paris",
      coordinates: { lat: 48.8606, lng: 2.3376 },
      driverLocation: { lat: 48.8584, lng: 2.2945 },
    })

    // Vérifier la disponibilité du backend au chargement
    checkBackendAvailability()
  }, [])

  const checkBackendAvailability = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 secondes timeout

      const response = await fetch("http://localhost:8000/", {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setBackendStatus("available")
        setIsDemoMode(false)
      } else {
        setBackendStatus("unavailable")
        setIsDemoMode(true)
      }
    } catch (error) {
      setBackendStatus("unavailable")
      setIsDemoMode(true)
    }
  }

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      return
    }

    setIsLoading(true)
    setTrackingResult(null)

    try {
      let data = null

      if (backendStatus === "available") {
        // Essayer d'abord avec le backend
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 secondes timeout

          const response = await fetch(`http://localhost:8000/api/track/${trackingNumber}`, {
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("TRACKING_NOT_FOUND")
            }
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          data = await response.json()
        } catch (error) {
          if (error.message === "TRACKING_NOT_FOUND") {
            throw error // Re-lancer l'erreur 404
          }

          // Si erreur réseau, basculer en mode démo
          console.warn("Backend indisponible, basculement en mode démo:", error)
          setBackendStatus("unavailable")
          setIsDemoMode(true)
          data = null // Forcer l'utilisation des données mockées
        }
      }

      // Si pas de données du backend ou mode démo, utiliser les données mockées
      if (!data) {
        data = getMockTrackingData(trackingNumber)
      }

      setTrackingResult(data)

      // Mettre à jour la livraison courante pour la carte
      setCurrentDelivery({
        ...data,
        id: "1",
        destination: data.recipient ? `Livraison pour ${data.recipient}` : "123 Rue de la Paix, 75001 Paris",
      })
    } catch (error) {
      console.error("Erreur lors du tracking:", error)

      if (error.message === "TRACKING_NOT_FOUND") {
        // Numéro de suivi non trouvé
        setTrackingResult({
          error: true,
          message: "Numéro de suivi non trouvé",
          trackingNumber: trackingNumber,
        })
      } else {
        // Autres erreurs - utiliser les données mockées
        const mockData = getMockTrackingData(trackingNumber)
        setTrackingResult(mockData)
        setIsDemoMode(true)

        // Mettre à jour la livraison courante pour la carte
        setCurrentDelivery({
          ...mockData,
          id: "1",
          destination: "123 Rue de la Paix, 75001 Paris",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getMockTrackingData = (trackingNum) => {
    // Données mockées basées sur le numéro de suivi
    const mockDatabase = {
      TRK123456: {
        trackingNumber: "TRK123456",
        status: "in_transit",
        sender: "Amazon France",
        recipient: "Jean Dupont",
        currentLocation: "Centre de tri Paris Nord",
        estimatedDelivery: "2024-01-15",
        coordinates: { lat: 48.8606, lng: 2.3376 },
        driverLocation: { lat: 48.8584, lng: 2.2945 },
        history: [
          {
            timestamp: "2024-01-12 09:00",
            status: "pending",
            description: "Commande créée",
          },
          {
            timestamp: "2024-01-12 14:30",
            status: "picked_up",
            description: "Colis récupéré par le transporteur",
          },
          {
            timestamp: "2024-01-13 08:15",
            status: "in_transit",
            description: "En transit vers le centre de tri Paris Nord",
          },
        ],
      },
      TRK789012: {
        trackingNumber: "TRK789012",
        status: "delivered",
        sender: "Fnac",
        recipient: "Marie Martin",
        currentLocation: "Livré",
        estimatedDelivery: "2024-01-14",
        coordinates: { lat: 48.8566, lng: 2.3522 },
        driverLocation: { lat: 48.8566, lng: 2.3522 },
        history: [
          {
            timestamp: "2024-01-11 10:00",
            status: "pending",
            description: "Commande créée",
          },
          {
            timestamp: "2024-01-11 16:45",
            status: "picked_up",
            description: "Colis récupéré par le transporteur",
          },
          {
            timestamp: "2024-01-12 09:30",
            status: "in_transit",
            description: "En transit vers Lyon",
          },
          {
            timestamp: "2024-01-14 11:20",
            status: "delivered",
            description: "Livré au destinataire",
          },
        ],
      },
      TRK345678: {
        trackingNumber: "TRK345678",
        status: "pending",
        sender: "Cdiscount",
        recipient: "Pierre Durand",
        currentLocation: "En attente de récupération",
        estimatedDelivery: "2024-01-16",
        coordinates: { lat: 48.8738, lng: 2.295 },
        driverLocation: { lat: 48.8738, lng: 2.295 },
        history: [
          {
            timestamp: "2024-01-13 15:30",
            status: "pending",
            description: "Commande créée et en attente",
          },
        ],
      },
    }

    // Retourner les données correspondantes ou générer des données par défaut
    if (mockDatabase[trackingNum]) {
      return mockDatabase[trackingNum]
    }

    // Générer des données par défaut pour tout autre numéro
    return {
      trackingNumber: trackingNum,
      status: "in_transit",
      sender: "Boutique en ligne",
      recipient: "Client",
      currentLocation: "En transit",
      estimatedDelivery: "2024-01-16",
      coordinates: { lat: 48.8566, lng: 2.3522 },
      driverLocation: { lat: 48.8584, lng: 2.2945 },
      history: [
        {
          timestamp: "2024-01-13 10:00",
          status: "pending",
          description: "Commande créée",
        },
        {
          timestamp: "2024-01-13 16:00",
          status: "picked_up",
          description: "Colis récupéré par le transporteur",
        },
        {
          timestamp: "2024-01-14 09:00",
          status: "in_transit",
          description: "En transit vers la destination",
        },
      ],
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "picked_up":
        return <Package className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Backend Status Alert */}
          {isDemoMode && (
            <Alert className="mb-8 border-blue-200 bg-blue-50 max-w-4xl mx-auto">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 flex items-center justify-between">
                <div>
                  <strong>Mode démonstration activé</strong> - Backend non disponible. Le suivi fonctionne avec des
                  données simulées.
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkBackendAvailability}
                  className="ml-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6 animate-pulse">
              <Shield className="h-4 w-4 mr-2" />
              Plateforme sécurisée et certifiée
            </div>

            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 animate-in slide-in-from-bottom-6 duration-1000 delay-200">
              Suivez vos livraisons
              <br />
              <span className="text-blue-600 animate-pulse">en temps réel</span>
            </h1>

            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-400">
              Notre plateforme de tracking avancée vous permet de suivre vos colis avec une précision millimétrique, des
              mises à jour en temps réel et une interface intuitive.
            </p>

            {/* Tracking Form */}
            <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-1000 delay-600">
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <Input
                    type="text"
                    placeholder="Entrez votre numéro de suivi (ex: TRK123456)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="flex-1 h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleTrack}
                    disabled={isLoading || !trackingNumber.trim()}
                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-medium"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    {isLoading ? "Recherche..." : "Suivre"}
                  </Button>
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  <p>Essayez avec: TRK123456, TRK789012, TRK345678, ou n'importe quel numéro</p>
                  {isDemoMode && (
                    <p className="text-blue-600 font-medium mt-1">
                      ⚡ Mode démo - Tous les numéros fonctionnent avec des données simulées
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Map Section */}
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Suivi en temps réel</h2>
              <p className="text-xl text-slate-600">Visualisez la position de vos colis sur une carte interactive</p>
              <p className="text-sm text-slate-500 mt-2">
                {isDemoMode ? "Mode démonstration - Interface simulée" : "Carte en temps réel"}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <MockMap delivery={currentDelivery} />
            </div>
          </div>

          {/* Tracking Result */}
          {trackingResult && (
            <Card className="max-w-4xl mx-auto mb-20 shadow-2xl border-0 bg-white/70 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              {trackingResult.error ? (
                <CardContent className="p-8 text-center">
                  <div className="bg-red-50 p-6 rounded-2xl">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-900 mb-2">Numéro de suivi non trouvé</h3>
                    <p className="text-red-700 mb-4">
                      Le numéro de suivi <strong>{trackingResult.trackingNumber}</strong> n'existe pas dans notre
                      système.
                    </p>
                    <p className="text-sm text-red-600">
                      Vérifiez le numéro ou contactez l'expéditeur pour plus d'informations.
                    </p>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">Colis {trackingResult.trackingNumber}</span>
                          {isDemoMode && (
                            <Badge variant="outline" className="text-blue-600 border-blue-200">
                              Mode Démo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 font-normal">
                          De {trackingResult.sender} vers {trackingResult.recipient}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <span className="font-semibold text-slate-700 text-lg">Statut actuel:</span>
                        <Badge className={`${getStatusColor(trackingResult.status)} text-white px-6 py-3 text-lg`}>
                          {getStatusIcon(trackingResult.status)}
                          <span className="ml-2 font-medium">{getStatusText(trackingResult.status)}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-2xl">
                        <MapPin className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-700 text-lg">Position actuelle</p>
                          <p className="text-slate-600">{trackingResult.currentLocation}</p>
                        </div>
                      </div>

                      <div className="border-t pt-8">
                        <h4 className="font-semibold text-slate-700 mb-6 flex items-center text-lg">
                          <Clock className="h-5 w-5 mr-2" />
                          Historique de livraison
                        </h4>
                        <div className="space-y-4">
                          {trackingResult.history.map((event, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-6 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                              <div className={`w-4 h-4 rounded-full ${getStatusColor(event.status)}`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-slate-700">{event.description}</span>
                                  <span className="text-sm text-slate-500">{event.timestamp}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Suivi en temps réel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Suivez vos colis en temps réel avec des mises à jour automatiques, notifications push et
                  géolocalisation précise.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Livraison express</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Livraison express dans toute la France en 24-48h avec notre réseau de partenaires certifiés et
                  optimisés.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">100% Sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Vos colis sont assurés et sécurisés avec notre technologie de tracking avancée et notre garantie
                  satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-16 text-white mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1200">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">Nos performances en chiffres</h3>
              <p className="text-blue-200 text-xl">La confiance de milliers de clients à travers la France</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 w-10" />
                </div>
                <div className="text-4xl font-bold mb-3 animate-pulse">50K+</div>
                <div className="text-blue-200 text-lg">Colis livrés</div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10" />
                </div>
                <div className="text-4xl font-bold mb-3 animate-pulse">10K+</div>
                <div className="text-blue-200 text-lg">Clients satisfaits</div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <div className="text-4xl font-bold mb-3 animate-pulse">99.8%</div>
                <div className="text-blue-200 text-lg">Taux de réussite</div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-10 w-10" />
                </div>
                <div className="text-4xl font-bold mb-3 animate-pulse">24h</div>
                <div className="text-blue-200 text-lg">Livraison moyenne</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1400">
            <h3 className="text-4xl font-bold text-slate-900 mb-6">Prêt à commencer ?</h3>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font confiance à Ahmed Livraison.e.t pour leurs livraisons
              quotidiennes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
                >
                  Devenir livreur
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-slate-300 hover:bg-slate-50">
                  Voir le dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
