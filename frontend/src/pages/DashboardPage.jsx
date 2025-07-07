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
  const [portfolio, setPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    const hasPaid = localStorage.getItem("hasPaid")
    if (!loading && user && hasPaid !== "true") {
      navigate("/pricing")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoadingPortfolio(true)
      const token = localStorage.getItem("token")
      try {
        const res = await fetch("http://localhost:5001/api/portfolio/finalized", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          setPortfolio(await res.json())
        } else {
          setPortfolio(null)
        }
      } catch {
        setPortfolio(null)
      } finally {
        setLoadingPortfolio(false)
      }
    }
    fetchPortfolio()
  }, [])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your portfolio?")) return
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:5001/api/portfolio", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setPortfolio(null)
  }

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
              value: "1", // This will need to be updated based on the new portfolio logic
              description: "1 finalized portfolio",
              color: "#3b82f6",
            },
            {
              title: "Total Views",
              value: "0", // This will need to be updated based on the new portfolio logic
              description: "Across all portfolios",
              color: "#8b5cf6",
            },
            {
              title: "This Month",
              value: "0", // This will need to be updated based on the new portfolio logic
              description: "+0% from last month",
              color: "#10b981",
            },
          ]}
        />

        {/* Main Content */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
          <Link to="/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Portfolio
            </Button>
          </Link>
        </div>
        {/* Portfolio Card */}
        {loadingPortfolio ? (
          <div className="text-center py-12">Loading...</div>
        ) : portfolio ? (
          <InteractiveCard3D>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{portfolio.fullName || "Portfolio"}</CardTitle>
                  <Badge variant="default">finalized</Badge>
                </div>
                <CardDescription>
                  Template: {portfolio.template} • Last updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Finalized</span>
                </div>
                <div className="flex space-x-2">
                  <Link to="/portfolio/preview">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to="/edit/new">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Download className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </InteractiveCard3D>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No portfolio yet</h3>
            <p className="text-gray-600 mb-4">Create your portfolio to get started</p>
            <Link to="/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your Portfolio
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
