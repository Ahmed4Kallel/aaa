"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { ChevronLeft, PackagePlus, CalendarIcon } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/config"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default function NewDeliveryPage() {
  const [sender, setSender] = useState("")
  const [recipient, setRecipient] = useState("")
  const [destination, setDestination] = useState("")
  const [weight, setWeight] = useState("")
  const [drivers, setDrivers] = useState<any[]>([]) // État pour stocker les livreurs
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null) // État pour l'ID du livreur sélectionné
  const [currentLocation, setCurrentLocation] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date>()
  const [selectedHour, setSelectedHour] = useState("12")
  const [selectedMinute, setSelectedMinute] = useState("00")
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user || user.role !== "admin") {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions d'administrateur pour accéder à cette page.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    const fetchDrivers = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Session expirée ou non autorisée",
          description: "Veuillez vous reconnecter.",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      try {
        const response = await fetch(API_ENDPOINTS.DRIVER.GET_DRIVERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Erreur lors du chargement des livreurs:", error)
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger la liste des livreurs.",
          variant: "destructive",
        })
      }
    }

    fetchDrivers()
  }, [router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        title: "Session expirée ou non autorisée",
        description: "Veuillez vous reconnecter.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // Générer un numéro de suivi unique
    const generatedTrackingNumber = `TRK${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const newDelivery = {
      tracking_number: generatedTrackingNumber, // Utiliser le numéro généré
      sender: sender,
      recipient: recipient,
      destination: destination,
      weight: parseFloat(weight),
      driver_id: selectedDriverId === "none" ? null : (selectedDriverId ? parseInt(selectedDriverId, 10) : null),
      current_location: currentLocation,
      estimated_delivery: estimatedDelivery ? 
        format(estimatedDelivery, `yyyy-MM-dd ${selectedHour}:${selectedMinute}`) : null,
    }

    try {
      const response = await fetch(API_ENDPOINTS.DELIVERIES.GET_ALL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDelivery),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Session expirée ou non autorisée",
            description: "Veuillez vous reconnecter avec un compte administrateur.",
            variant: "destructive",
          })
          router.push("/auth/login")
        }
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      toast({
        title: "Succès !",
        description: `La nouvelle livraison (Numéro de suivi: ${generatedTrackingNumber}) a été créée avec succès.`, // Message de succès avec le numéro généré
        variant: "default",
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Erreur lors de la création de la livraison:", error)
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur inattendue est survenue.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center py-12">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" /> Retour au Dashboard
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 mb-2 flex items-center">
            <PackagePlus className="h-7 w-7 mr-3 text-blue-600" />
            Nouvelle Livraison
          </CardTitle>
          <CardDescription className="text-slate-600">
            Remplissez les informations ci-dessous pour créer une nouvelle livraison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sender" className="text-slate-700">Expéditeur</Label>
                <Input
                  id="sender"
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Ex: Amazon"
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipient" className="text-slate-700">Destinataire</Label>
                <Input
                  id="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="destination" className="text-slate-700">Destination</Label>
                <Input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: 123 Rue de la Paix, Paris"
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight" className="text-slate-700">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 2.5"
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="currentLocation" className="text-slate-700">Localisation actuelle</Label>
                <Input
                  id="currentLocation"
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="Ex: Entrepôt Paris Nord"
                  required
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedDelivery" className="text-slate-700">Livraison estimée</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !estimatedDelivery && "text-muted-foreground",
                          estimatedDelivery && "text-accent-foreground"
                        )}
                      >
                        {estimatedDelivery ? (
                          format(estimatedDelivery, "EEEE, d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={estimatedDelivery}
                        onSelect={(date) => {
                          setEstimatedDelivery(date)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {/* Sélecteur d'heure */}
                  <Select value={selectedHour} onValueChange={setSelectedHour}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span className="flex items-center text-slate-500">:</span>
                  
                  {/* Sélecteur de minute */}
                  <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {estimatedDelivery && (
                  <p className="text-sm text-slate-500 mt-1">
                    Date sélectionnée : {format(estimatedDelivery, "EEEE, d MMMM yyyy", { locale: fr })} à {selectedHour}:{selectedMinute}
                  </p>
                )}
              </div>
            </div>

            {/* New Driver Selection Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driver" className="text-slate-700">Livreur (Optionnel)</Label>
                <Select value={selectedDriverId || ""} onValueChange={setSelectedDriverId}>
                  <SelectTrigger id="driver" className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Sélectionner un livreur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Non assigné</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={String(driver.id)}>
                        {driver.first_name} {driver.last_name} ({driver.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-lg">
              Créer la livraison
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 