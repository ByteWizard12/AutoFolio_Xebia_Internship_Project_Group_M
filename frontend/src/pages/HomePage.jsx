import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { ArrowRight, Github, Linkedin, FileText, Zap, Shield, Globe, Download } from "lucide-react"

import { FloatingShapes } from "../components/3d/floating-shapes"
import { InteractiveCard3D } from "../components/3d/interactive-card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AutoFolio</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#templates" className="text-gray-600 hover:text-gray-900">
              Templates
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Elements */}
      <section className="relative py-20 px-4 overflow-hidden">
        <FloatingShapes />
        <div className="container mx-auto text-center relative z-10">
          <Badge className="text-xl mb-10" variant="secondary">
            🚀 Generate portfolios in minutes
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Portfolio Website Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create stunning, professional portfolio websites automatically using your LinkedIn, GitHub, and resume data.
            No coding required, just beautiful results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Start Building <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create an amazing portfolio</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Linkedin className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Auto Data Import</CardTitle>
                  <CardDescription>
                    Import your professional data from LinkedIn, GitHub, and resume files automatically
                  </CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>

            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Smart Resume Parsing</CardTitle>
                  <CardDescription>
                    Upload your resume and let AI extract skills, experience, and education automatically
                  </CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>

            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Instant Hosting</CardTitle>
                  <CardDescription>
                    Deploy your portfolio to a public URL instantly or download static files
                  </CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>

            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See your changes in real-time with our interactive preview system</CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>

            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your data is encrypted and secure with enterprise-grade security measures
                  </CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>

            <InteractiveCard3D>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle>Multiple Export Options</CardTitle>
                  <CardDescription>
                    Download as ZIP, deploy online, or generate QR codes for easy sharing
                  </CardDescription>
                </CardHeader>
              </Card>
            </InteractiveCard3D>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Portfolio?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have created stunning portfolios with AutoPort
          </p>
          <Link to="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AutoPort</span>
              </div>
              <p className="text-gray-400">Create professional portfolios automatically from your existing data.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Github className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AutoFolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
