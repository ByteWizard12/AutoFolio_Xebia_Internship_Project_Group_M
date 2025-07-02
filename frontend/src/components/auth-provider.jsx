import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  //add by vaibhav 
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-fetch user & subscription if token exists
  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch current user
        const userRes = await fetch("http://localhost:5001/api/auth/me", {
          headers: { token },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");

        const userData = await userRes.json();
        setUser(userData);

        // Fetch subscription
        const subRes = await fetch("http://localhost:5001/api/user/me/subscription", {
          headers: { token },
        });

        if (!subRes.ok) throw new Error("Failed to fetch subscription");

        const { subscription } = await subRes.json();
        setSubscription(subscription);

        // Save payment status for redirection check
        if (subscription?.status === "active") {
          localStorage.setItem("hasPaid", "true");
        } else {
          localStorage.setItem("hasPaid", "false");
        }
      } catch (err) {
        console.error("AuthProvider Error:", err);
        localStorage.removeItem("hasPaid");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, []);
  //edit end 

  const register = async (name, email, password) => {
    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Registration error:", error);
      return false;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return true;
  };

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);

    // Fetch subscription after login
    try {
      const subRes = await fetch("http://localhost:5001/api/user/me/subscription", {
        headers: { token: data.token },
      });
      const { subscription } = await subRes.json();
      setSubscription(subscription);
      localStorage.setItem("hasPaid", subscription?.status === "active" ? "true" : "false");
    } catch (e) {
      console.error("Subscription fetch error:", e);
    }

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasPaid");
    setUser(null);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider value={{ user, subscription, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
