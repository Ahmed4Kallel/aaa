import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/config"

export async function GET(request: NextRequest, { params }: { params: Promise<{ trackingNumber: string }> }) {
  const { trackingNumber } = await params

  try {
    // Call the backend API
    const response = await fetch(API_ENDPOINTS.TRACKING.GET_PACKAGE(trackingNumber))
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Numéro de suivi non trouvé" }, { status: 404 })
      }
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tracking data:', error)
    
    // Fallback to mock data in case of connection issues
    return NextResponse.json({ 
      error: "Erreur de connexion au serveur", 
      message: "Impossible de se connecter au serveur de suivi. Veuillez réessayer plus tard."
    }, { status: 500 })
  }
}
