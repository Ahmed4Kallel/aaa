import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Récupérer les données de la requête
    const userData = await request.json();
    
    try {
      // Envoyer la requête au backend avec un timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes timeout
      
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Récupérer la réponse du backend
      const data = await response.json();
      
      // Si la réponse n'est pas OK, renvoyer l'erreur
      if (!response.ok) {
        return NextResponse.json(
          { error: data.detail || "Erreur lors de l'inscription" },
          { status: response.status }
        );
      }
      
      // Renvoyer la réponse du backend
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error("Erreur de connexion au backend:", fetchError);
      
      // Simuler une réponse de succès en mode démo
      console.log("Simulation d'une inscription réussie en mode démo");
      
      // Renvoyer une réponse simulée
      return NextResponse.json(
        { 
          message: "Utilisateur créé avec succès (Mode démo - backend non connecté)",
          demo: true 
        }
      );
    }
  } catch (error: any) {
    console.error("Erreur lors de l'inscription:", error);
    
    // Renvoyer une erreur 500 en cas d'erreur
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
