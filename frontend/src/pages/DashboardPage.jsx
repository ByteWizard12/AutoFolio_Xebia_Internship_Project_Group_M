"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../components/auth-provider"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Plus, Eye, Download, Share2, Settings, LogOut, Zap } from "lucide-react"
import { DashboardStats3D } from "../components/3d/dashboard-stats-3d"
import { InteractiveCard3D } from "../components/3d/interactive-card"

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [portfolios, setPortfolios] = useState([
    {
      id: "1",
      name: "My Professional Portfolio",
      template: "Modern",
      status: "published",
      url: "autoport.site/johndoe/portfolio1",
      createdAt: "2024-01-15",
      views: 234,
    },
    {
      id: "2",
      name: "Creative Portfolio",
      template: "Creative",
      status: "draft",
      createdAt: "2024-01-20",
      views: 0,
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login")
    }
  }, [user, loading, navigate])
//Edit by vaibhav
  useEffect(() => {
  const hasPaid = localStorage.getItem("hasPaid")
  if (!loading && user && hasPaid !== "true") {
    navigate("/pricing")
  }
}, [user, loading, navigate])

//edit till this line 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Autofolio</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <Link to="/dashboard/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 3D Stats Cards */}
        <DashboardStats3D
          stats={[
            {
              title: "Total Portfolios",
              value: portfolios.length.toString(),
              description: `${portfolios.filter((p) => p.status === "published").length} published`,
              color: "#3b82f6",
            },
            {
              title: "Total Views",
              value: portfolios.reduce((sum, p) => sum + p.views, 0).toString(),
              description: "Across all portfolios",
              color: "#8b5cf6",
            },
            {
              title: "This Month",
              value: "156",
              description: "+12% from last month",
              color: "#10b981",
            },
          ]}
        />

        {/* Main Content */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Portfolios</h1>
          <Link to="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Portfolio
            </Button>
          </Link>
        </div>

        {/* Portfolios Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <InteractiveCard3D key={portfolio.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    <Badge variant={portfolio.status === "published" ? "default" : "secondary"}>
                      {portfolio.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Template: {portfolio.template} • Created {new Date(portfolio.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{portfolio.views} views</span>
                    {portfolio.url && <span className="text-blue-600 truncate">{portfolio.url}</span>}
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/edit/${portfolio.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    {portfolio.status === "published" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </InteractiveCard3D>
          ))}
        </div>

        {portfolios.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No portfolios yet</h3>
            <p className="text-gray-600 mb-4">Create your first portfolio to get started</p>
            <Link to="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
