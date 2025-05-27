"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"
import type { google } from "google-maps"

interface GoogleMapProps {
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

export default function GoogleMap({ delivery }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)

  // Coordonnées par défaut (Paris)
  const defaultCoords = { lat: 48.8566, lng: 2.3522 }

  // Coordonnées de livraison simulées
  const deliveryCoords = delivery?.coordinates || { lat: 48.8606, lng: 2.3376 }
  const driverCoords = delivery?.driverLocation || { lat: 48.8584, lng: 2.2945 }

  useEffect(() => {
    // Vérifier si Google Maps est disponible
    if (!mapRef.current) return

    if (!window.google) {
      console.warn("Google Maps API not loaded")
      return
    }

    try {
      // Initialiser la carte
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: deliveryCoords,
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ weight: "2.00" }],
          },
          {
            featureType: "all",
            elementType: "geometry.stroke",
            stylers: [{ color: "#9c9c9c" }],
          },
          {
            featureType: "all",
            elementType: "labels.text",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [{ color: "#f2f2f2" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#eeeeee" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7b7b7b" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#46bcec" }, { visibility: "on" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#c8d7d4" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#070707" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }],
          },
        ],
      })

      setMap(mapInstance)

      // Initialiser les services de directions
      const directionsServiceInstance = new window.google.maps.DirectionsService()
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#3B82F6",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      })

      directionsRendererInstance.setMap(mapInstance)
      setDirectionsService(directionsServiceInstance)
      setDirectionsRenderer(directionsRendererInstance)

      // Marqueur de destination
      const destinationMarker = new window.google.maps.Marker({
        position: deliveryCoords,
        map: mapInstance,
        title: `Livraison pour ${delivery?.recipient || "Client"}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#EF4444",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        },
        animation: window.google.maps.Animation.BOUNCE,
      })

      // Marqueur du livreur
      const driverMarker = new window.google.maps.Marker({
        position: driverCoords,
        map: mapInstance,
        title: "Position du livreur",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10B981",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      })

      // InfoWindow pour la destination
      const destinationInfoWindow = new window.google.maps.InfoWindow({
        content: `
        <div class="p-3">
          <h3 class="font-semibold text-gray-900">${delivery?.recipient || "Destination"}</h3>
          <p class="text-sm text-gray-600">${delivery?.destination || "Adresse de livraison"}</p>
          <p class="text-xs text-blue-600 mt-1">📦 ${delivery?.trackingNumber || "TRK123456"}</p>
        </div>
      `,
      })

      // InfoWindow pour le livreur
      const driverInfoWindow = new window.google.maps.InfoWindow({
        content: `
        <div class="p-3">
          <h3 class="font-semibold text-gray-900">🚚 Livreur en route</h3>
          <p class="text-sm text-gray-600">Position actuelle</p>
          <p class="text-xs text-green-600 mt-1">En transit vers la destination</p>
        </div>
      `,
      })

      // Événements de clic sur les marqueurs
      destinationMarker.addListener("click", () => {
        driverInfoWindow.close()
        destinationInfoWindow.open(mapInstance, destinationMarker)
      })

      driverMarker.addListener("click", () => {
        destinationInfoWindow.close()
        driverInfoWindow.open(mapInstance, driverMarker)
      })

      // Calculer et afficher l'itinéraire
      if (delivery?.status === "in_transit" || delivery?.status === "picked_up") {
        directionsServiceInstance.route(
          {
            origin: driverCoords,
            destination: deliveryCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false,
          },
          (result, status) => {
            if (status === "OK" && result) {
              directionsRendererInstance.setDirections(result)
            }
          },
        )
      }

      // Simulation du mouvement du livreur
      let animationStep = 0
      const animateDriver = () => {
        if (delivery?.status === "in_transit") {
          animationStep += 0.001
          const newLat = driverCoords.lat + Math.sin(animationStep) * 0.002
          const newLng = driverCoords.lng + Math.cos(animationStep) * 0.002

          driverMarker.setPosition({ lat: newLat, lng: newLng })

          setTimeout(animateDriver, 2000)
        }
      }

      if (delivery?.status === "in_transit") {
        setTimeout(animateDriver, 1000)
      }

      // Cleanup
      return () => {
        if (destinationMarker) destinationMarker.setMap(null)
        if (driverMarker) driverMarker.setMap(null)
        if (directionsRendererInstance) directionsRendererInstance.setMap(null)
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Google Maps:", error)
    }
  }, [delivery])

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
        <div ref={mapRef} className="w-full h-96 rounded-b-lg relative" style={{ minHeight: "400px" }}>
          {!window.google && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-b-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Chargement de la carte...</p>
                <p className="text-sm text-slate-500">Mode démo - Carte simulée</p>
              </div>
            </div>
          )}
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
