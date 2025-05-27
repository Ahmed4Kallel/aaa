import { NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/config"

export async function GET() {
  try {
    // Call the backend API
    const response = await fetch(API_ENDPOINTS.STATS.GET_STATS)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stats data:', error)
    
    // Fallback to mock data in case of connection issues
    const fallbackStats = {
      total: 25,
      pending: 5,
      inTransit: 8,
      delivered: 12,
    }
    
    return NextResponse.json(fallbackStats)
  }
}
