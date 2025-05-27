"use client"

import { Package, Truck, Shield, Clock, Globe, Zap, CheckCircle, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Livraison Express",
      description: "Livraison en 24h dans toute la France",
      features: ["Suivi en temps réel", "Assurance incluse", "Support 24/7"],
      price: "À partir de 9.99€",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Livraison Standard",
      description: "Livraison en 2-3 jours ouvrés",
      features: ["Économique", "Fiable", "Écologique"],
      price: "À partir de 4.99€",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Livraison Internationale",
      description: "Expédition dans le monde entier",
      features: ["Dédouanement inclus", "Suivi international", "Assurance"],
      price: "À partir de 19.99€",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Livraison Programmée",
      description: "Choisissez votre créneau de livraison",
      features: ["Créneaux flexibles", "SMS de confirmation", "Reprogrammation"],
      price: "À partir de 7.99€",
      color: "from-amber-500 to-amber-600",
    },
  ]

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sécurité garantie",
      description: "Tous vos colis sont assurés et protégés",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Réseau étendu",
      description: "Plus de 1000 points de livraison en France",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Satisfaction client",
      description: "99.8% de taux de satisfaction client",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Service premium",
      description: "Support client dédié et personnalisé",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-6">
              Nos Services
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez notre gamme complète de services de livraison adaptés à tous vos besoins, du particulier à
              l'entreprise.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:scale-105"
              >
                <CardHeader>
                  <div
                    className={`bg-gradient-to-r ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-slate-600">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {service.price}
                    </Badge>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      Choisir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Pourquoi nous choisir ?</h2>
              <p className="text-xl text-slate-600">Les avantages qui font la différence</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/70 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-3xl p-12 text-white text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
            <h3 className="text-3xl font-bold mb-4">Prêt à expédier ?</h3>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits et découvrez la différence DeliveryTracker Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4">
                  Commencer maintenant
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
