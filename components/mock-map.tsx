"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Truck, Package } from "lucide-react"

interface MockMapProps {
  delivery?: {
    id: string
    trackingNumber: string
    recipient: string
    destination: string
    status: string
    currentLocation: string
    coordinates?: {
      lat: number
      lng: number
    }
    driverLocation?: {
      lat: number
      lng: number
    }
  }
}

export default function MockMap({ delivery }: MockMapProps) {
  const [driverPosition, setDriverPosition] = useState({ x: 20, y: 60 })
  const [showRoute, setShowRoute] = useState(false)

  useEffect(() => {
    setShowRoute(true)

    // Animation du livreur si en transit
    if (delivery?.status === "in_transit") {
      const interval = setInterval(() => {
        setDriverPosition((prev) => ({
          x: Math.min(prev.x + 0.5, 75),
          y: prev.y + (Math.random() - 0.5) * 2,
        }))
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [delivery?.status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500"
      case "picked_up":
        return "bg-blue-500"
      case "in_transit":
        return "bg-purple-500"
      case "delivered":
        return "bg-emerald-500"
      default:
        return "bg-slate-500"
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
    <Card className="w-full h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Suivi en temps réel</span>
          </CardTitle>
          {delivery && (
            <Badge className={`${getStatusColor(delivery.status)} text-white`}>{getStatusText(delivery.status)}</Badge>
          )}
        </div>
        {delivery && (
          <div className="text-sm text-slate-600">
            <p className="font-medium">{delivery.trackingNumber}</p>
            <p>Destination: {delivery.recipient}</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-b-lg overflow-hidden">
          {/* Fond de carte stylisé */}
          <div className="absolute inset-0">
            {/* Routes simulées */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Route principale */}
              <path
                d="M 10 60 Q 30 50 50 55 Q 70 60 85 50"
                stroke="#e5e7eb"
                strokeWidth="2"
                fill="none"
                className="opacity-60"
              />
              {/* Routes secondaires */}
              <path
                d="M 20 30 Q 40 35 60 30 Q 80 25 90 30"
                stroke="#f3f4f6"
                strokeWidth="1.5"
                fill="none"
                className="opacity-40"
              />
              <path
                d="M 15 80 Q 35 75 55 80 Q 75 85 90 80"
                stroke="#f3f4f6"
                strokeWidth="1.5"
                fill="none"
                className="opacity-40"
              />

              {/* Itinéraire actif */}
              {showRoute && delivery?.status === "in_transit" && (
                <path
                  d="M 20 60 Q 40 55 60 58 Q 75 60 80 55"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                  strokeDasharray="5,5"
                />
              )}
            </svg>

            {/* Zones urbaines simulées */}
            <div className="absolute top-4 left-4 w-8 h-6 bg-slate-200 rounded opacity-30"></div>
            <div className="absolute top-8 right-8 w-12 h-8 bg-slate-200 rounded opacity-30"></div>
            <div className="absolute bottom-12 left-8 w-10 h-6 bg-slate-200 rounded opacity-30"></div>
            <div className="absolute bottom-8 right-12 w-6 h-10 bg-slate-200 rounded opacity-30"></div>

            {/* Parcs/espaces verts */}
            <div className="absolute top-16 left-16 w-16 h-12 bg-green-200 rounded-full opacity-40"></div>
            <div className="absolute bottom-20 right-20 w-12 h-12 bg-green-200 rounded-full opacity-40"></div>
          </div>

          {/* Marqueur de destination */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: "80%", top: "55%" }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce">
                <Package className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              {/* Tooltip destination */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap border">
                <div className="font-medium">{delivery?.recipient || "Destination"}</div>
                <div className="text-slate-500">{delivery?.trackingNumber || "TRK123456"}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white"></div>
              </div>
            </div>
          </div>

          {/* Marqueur du livreur */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-2000 ease-linear"
            style={{ left: `${driverPosition.x}%`, top: `${driverPosition.y}%` }}
          >
            <div className="relative">
              <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </div>
              {/* Tooltip livreur */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                <Truck className="w-3 h-3 inline mr-1" />
                Livreur
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-emerald-600"></div>
              </div>
            </div>
          </div>

          {/* Indicateur de mouvement */}
          {delivery?.status === "in_transit" && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-700 font-medium">En mouvement</span>
              </div>
            </div>
          )}

          {/* Légende */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span>Livreur</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Destination</span>
              </div>
              {showRoute && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Itinéraire</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {delivery && (
          <div className="p-4 bg-slate-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Livreur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium">Destination</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Navigation className="h-4 w-4" />
                <span>Temps estimé: 15 min</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
