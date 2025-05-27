"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, Clock, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function Dashboard() {
  const [deliveries, setDeliveries] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchDeliveries()
    fetchStats()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/deliveries")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setDeliveries(data)
    } catch (error) {
      console.error("Erreur lors du chargement des livraisons:", error)
      // Utiliser des données mockées en cas d'erreur de connexion au backend
      const mockDeliveries = [
        {
          id: "1",
          trackingNumber: "TRK123456",
          recipient: "Jean Dupont",
          destination: "123 Rue de la Paix, Paris",
          status: "in_transit",
          createdAt: "2024-01-12",
          weight: 2.5,
        },
        {
          id: "2",
          trackingNumber: "TRK789012",
          recipient: "Marie Martin",
          destination: "456 Avenue des Champs, Lyon",
          status: "delivered",
          createdAt: "2024-01-11",
          weight: 1.2,
        },
        {
          id: "3",
          trackingNumber: "TRK345678",
          recipient: "Pierre Durand",
          destination: "789 Boulevard Saint-Michel, Marseille",
          status: "pending",
          createdAt: "2024-01-13",
          weight: 3.8,
        },
        {
          id: "4",
          trackingNumber: "TRK901234",
          recipient: "Sophie Leblanc",
          destination: "321 Rue Victor Hugo, Toulouse",
          status: "picked_up",
          createdAt: "2024-01-13",
          weight: 0.8,
        },
        {
          id: "5",
          trackingNumber: "TRK567890",
          recipient: "Antoine Moreau",
          destination: "654 Place de la République, Nice",
          status: "in_transit",
          createdAt: "2024-01-12",
          weight: 4.2,
        },
      ]
      setDeliveries(mockDeliveries)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/stats")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
      // Utiliser des statistiques mockées en cas d'erreur
      setStats({
        total: 25,
        pending: 5,
        inTransit: 8,
        delivered: 12,
      })
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

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Dashboard Admin
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">DeliveryTracker Pro</p>
                </div>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Espace Livreur
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard des Livraisons</h2>
          <p className="text-slate-600">Gérez et suivez toutes vos livraisons en temps réel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Total</CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-600">Livraisons totales</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">En attente</CardTitle>
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
              <p className="text-xs text-slate-600">À traiter</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">En transit</CardTitle>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Truck className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.inTransit}</div>
              <p className="text-xs text-slate-600">En cours</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Livrées</CardTitle>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.delivered}</div>
              <p className="text-xs text-slate-600">Terminées</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par numéro de suivi ou destinataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle livraison
          </Button>
        </div>

        {/* Deliveries Table */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900">Livraisons récentes</CardTitle>
            <CardDescription className="text-slate-600">
              Liste de toutes les livraisons avec leur statut actuel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-700">Numéro de suivi</TableHead>
                  <TableHead className="text-slate-700">Destinataire</TableHead>
                  <TableHead className="text-slate-700">Destination</TableHead>
                  <TableHead className="text-slate-700">Statut</TableHead>
                  <TableHead className="text-slate-700">Date de création</TableHead>
                  <TableHead className="text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-900">{delivery.trackingNumber}</TableCell>
                    <TableCell className="text-slate-700">{delivery.recipient}</TableCell>
                    <TableCell className="text-slate-700">{delivery.destination}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-1">{getStatusText(delivery.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{delivery.createdAt}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
