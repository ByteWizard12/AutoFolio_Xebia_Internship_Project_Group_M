"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem("autoport_user_token")
    if (savedToken) {
      // You might want to decode the token and get user info
      // For now, we'll just assume if a token exists, the user is "logged in"
      // You could store user details in localStorage as well during login
      setUser({ token: savedToken });
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        if(token){
          localStorage.setItem("autoport_user_token" , token);
          setUser({email}) // Or more user details from response
          return true;
        }
      }
      return false;
    }catch(e){
      console.error("Login error", e);
      return false;
    }
  }

  const register = async (fullName, email, password) => {
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    try {
      const response = await fetch("http://localhost:8000/api/v1/user/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      return response.ok;
    }catch(e){
      console.error("Register error", e);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("autoport_user_token")
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
