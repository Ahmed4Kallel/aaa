"use client"

import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Restez informé de nos actualités</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Recevez les dernières mises à jour sur nos services, nouvelles fonctionnalités et offres spéciales.
            </p>
            <div className="flex max-w-md mx-auto space-x-3">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="bg-white/10 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Ahmed Livraison.e.t</h3>
                <p className="text-xs text-slate-400">Logistics Excellence</p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              La plateforme de référence pour le suivi de livraisons en temps réel. Nous connectons les expéditeurs, les
              livreurs et les destinataires pour une expérience optimale.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                "Suivi en temps réel",
                "Livraison express",
                "Livraison programmée",
                "Livraison internationale",
                "Assurance colis",
                "Support 24/7",
              ].map((service) => (
                <li key={service}>
                  <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                "Centre d'aide",
                "FAQ",
                "Nous contacter",
                "Signaler un problème",
                "Conditions d'utilisation",
                "Politique de confidentialité",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-slate-300">nabeul tunisia 8000 afh 2</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-slate-300">+216 44 128 333</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-slate-300">contact@ahmedlivraison.et</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">© 2024 Ahmed Livraison.e.t. Tous droits réservés.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
