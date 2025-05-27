import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/config"

export async function GET() {
  try {
    // Call the backend API
    const response = await fetch(API_ENDPOINTS.DELIVERIES.GET_ALL)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching deliveries data:', error)
    
    // Fallback to mock data in case of connection issues
    return NextResponse.json({ 
      error: "Erreur de connexion au serveur", 
      message: "Impossible de se connecter au serveur. Veuillez réessayer plus tard."
    }, { status: 500 })
  }
}
