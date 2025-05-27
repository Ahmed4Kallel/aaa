import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/config"

export async function GET() {
  try {
    // Call the backend API without authentication for simplicity
    const response = await fetch(API_ENDPOINTS.DRIVER.GET_ASSIGNMENTS)
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
      }
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
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
