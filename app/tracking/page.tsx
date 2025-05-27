"use client"

import { useState } from "react"
import { Search, Package, MapPin, Clock, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MockMap from "@/components/mock-map"

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingResult, setTrackingResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/track/${trackingNumber}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTrackingResult(data)
    } catch (error) {
      console.error("Erreur lors du tracking:", error)
      // Fallback avec données mockées
      const mockTrackingData = {
        trackingNumber: trackingNumber,
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
      }
      setTrackingResult(mockTrackingData)
    } finally {
      setIsLoading(false)
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

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-4">
              Suivi de colis
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Entrez votre numéro de suivi pour connaître la position exacte de votre colis en temps réel
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-2xl mx-auto mb-12 animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <Input
                    type="text"
                    placeholder="Numéro de suivi (ex: TRK123456)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="flex-1 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleTrack}
                    disabled={isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? "Recherche..." : "Suivre"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Result */}
          {trackingResult && (
            <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Map */}
              <div className="order-2 lg:order-1">
                <MockMap delivery={trackingResult} />
              </div>

              {/* Details */}
              <div className="order-1 lg:order-2 space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-xl">Colis {trackingResult.trackingNumber}</span>
                        <p className="text-sm text-slate-600 font-normal">
                          De {trackingResult.sender} vers {trackingResult.recipient}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="font-semibold text-slate-700">Statut actuel:</span>
                      <Badge className={`${getStatusColor(trackingResult.status)} text-white px-4 py-2`}>
                        {getStatusIcon(trackingResult.status)}
                        <span className="ml-2 font-medium">{getStatusText(trackingResult.status)}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-700">Position actuelle</p>
                        <p className="text-slate-600">{trackingResult.currentLocation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Historique de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trackingResult.history.map((event, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-700">{event.description}</span>
                              <span className="text-sm text-slate-500">{event.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
