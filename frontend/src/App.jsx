import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./components/auth-provider"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import DashboardPage from "./pages/DashboardPage"
import CreatePortfolioPage from "./pages/CreatePortfolioPage"
import EditPortfolioPage from "./pages/EditPortfolioPage"
import SettingsPage from "./pages/SettingsPage"
//edit by vaibhav 
import PricingPage from "./pages/PricingPage"
//edit end by vaibhav 
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreatePortfolioPage />} />
            <Route path="/edit/:id" element={<EditPortfolioPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/pricing" element={<PricingPage />} /> 
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
