import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/config"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Récupérer le token depuis les cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      console.log('Token manquant dans les cookies')
      return NextResponse.json({ error: "Token manquant. Veuillez vous reconnecter." }, { status: 401 })
    }

    console.log('Token trouvé, appel de l\'API backend...')
    console.log('Token (premiers 20 chars):', token.substring(0, 20) + '...')

    // Call the backend API with authentication
    const response = await fetch(API_ENDPOINTS.DRIVER.GET_ASSIGNMENTS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    console.log(`Réponse du backend: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log(`Erreur du backend: ${response.status} - ${errorText}`)
      
      if (response.status === 401) {
        return NextResponse.json({ error: "Session expirée ou non autorisé. Veuillez vous reconnecter." }, { status: 401 })
      }
      if (response.status === 403) {
        return NextResponse.json({ error: "Accès refusé. Vous n'avez pas le rôle chauffeur." }, { status: 403 })
      }
      return NextResponse.json({ error: `Erreur API: ${response.status} - ${errorText}` }, { status: response.status })
    }
    
    const data = await response.json()
    console.log(`Données reçues du backend: ${JSON.stringify(data).substring(0, 200)}...`)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching driver assignments:', error)
    
    // Fallback to mock data in case of connection issues
    const fallbackAssignments = [
      {
        id: "1",
        trackingNumber: "TRK123456",
        recipient: "Jean Dupont",
        destination: "123 Rue de la Paix, 75001 Paris",
        status: "in_transit",
        weight: 2.5,
        priority: "normal",
        estimatedDelivery: "2024-01-15 14:00",
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
      },
    ]
    
    return NextResponse.json(fallbackAssignments)
  }
}
