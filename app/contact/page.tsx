"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false)
      alert("Message envoyé avec succès !")
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande
              d'information.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-in slide-in-from-left-4 duration-1000 delay-200">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Sujet</Label>
                      <Select onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Choisissez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Question générale</SelectItem>
                          <SelectItem value="support">Support technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="partnership">Partenariat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        rows={6}
                        className="mt-1"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Envoi en cours...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-1000 delay-400">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Adresse</h3>
                      <p className="text-slate-600">123 Avenue des Champs-Élysées</p>
                      <p className="text-slate-600">75008 Paris, France</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Téléphone</h3>
                      <p className="text-slate-600">+33 1 23 45 67 89</p>
                      <p className="text-slate-600">Lun-Ven: 9h-18h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email</h3>
                      <p className="text-slate-600">contact@deliverytracker.pro</p>
                      <p className="text-slate-600">support@deliverytracker.pro</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Horaires</h3>
                      <p className="text-slate-600">Lundi - Vendredi: 9h - 18h</p>
                      <p className="text-slate-600">Samedi: 9h - 12h</p>
                      <p className="text-slate-600">Dimanche: Fermé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Support 24/7</h3>
                  <p className="mb-4">
                    Pour les urgences et le support technique, notre équipe est disponible 24h/24 et 7j/7.
                  </p>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100">
                    Accéder au support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
