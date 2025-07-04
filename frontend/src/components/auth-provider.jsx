import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch user & subscription on load
  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await fetch("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");

        const userData = await userRes.json();
        setUser(userData);

        const subRes = await fetch("http://localhost:5001/api/user/me/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!subRes.ok) throw new Error("Failed to fetch subscription");

        const { subscription } = await subRes.json();
        setSubscription(subscription);

        const isActive = subscription?.status === "active";
        localStorage.setItem("hasPaid", isActive ? "true" : "false");
      } catch (err) {
        console.error("❌ AuthProvider Error:", err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("hasPaid");
        setUser(null);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSubscription();
  }, []);

  // 📝 Register
  const register = async (name, email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Registration error:", data);
        return { success: false, error: data };
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);

      const isActive = data.user?.subscription === "active";
      localStorage.setItem("hasPaid", isActive ? "true" : "false");

      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      console.error("🔥 Registration failed:", err.message);
      return { success: false, error: { message: "Server error" } };
    }
  };

  // 🔐 Login
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok && res.status !== 403) {
        console.warn("Login failed:", data);
        localStorage.removeItem("token");
        localStorage.removeItem("hasPaid");
        return {
          success: false,
          status: res.status,
          message: data?.message || data?.error || "Login failed",
        };
      }

      // Handle both 200 (active) and 403 (inactive) as success
      const isActive = res.status === 200;
      
      // Save token & user
      localStorage.setItem("token", data.token);
      setUser(data.user);

      // Fetch subscription
      const subRes = await fetch("http://localhost:5001/api/user/me/subscription", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      let subData = null;
      if (subRes.ok) {
        const { subscription } = await subRes.json();
        setSubscription(subscription);
        subData = subscription;
      } else {
        setSubscription(null);
      }

      const finalIsActive = subData?.status === "active" || isActive;
      localStorage.setItem("hasPaid", finalIsActive ? "true" : "false");

      return {
        success: true,
        token: data.token,
        user: {
          ...data.user,
          isActive: finalIsActive,
        },
      };
    } catch (err) {
      console.error("🔥 Login error:", err.message);
      return {
        success: false,
        status: 500,
        message: "Server error",
      };
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasPaid");
    setUser(null);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
