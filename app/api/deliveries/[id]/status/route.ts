import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await request.json()

  // Simulation d'un délai de réseau
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Dans une vraie application, vous mettriez à jour la base de données ici
  console.log(`Mise à jour du statut de la livraison ${id} vers ${status}`)

  return NextResponse.json({
    success: true,
    message: "Statut mis à jour avec succès",
  })
}
