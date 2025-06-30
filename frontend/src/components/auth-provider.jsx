"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("autoport_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
      }

      setUser(mockUser)
      localStorage.setItem("autoport_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const mockUser = {
        id: "1",
        email,
        name,
      }

      setUser(mockUser)
      localStorage.setItem("autoport_user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("autoport_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
