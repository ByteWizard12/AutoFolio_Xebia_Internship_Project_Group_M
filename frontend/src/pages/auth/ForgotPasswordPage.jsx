"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useToast } from "../../hooks/use-toast"
import { Zap, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSent(true)
    toast({
      title: "Reset link sent",
      description: "Check your email for password reset instructions.",
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">AutoFolio</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              {sent ? "We've sent you a password reset link" : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSent(false)} className="flex-1">
                    Try Again
                  </Button>
                  <Link to="/auth/login" className="flex-1">
                    <Button className="w-full">Back to Login</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {!sent && (
              <div className="mt-6 text-center">
                <Link to="/auth/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
