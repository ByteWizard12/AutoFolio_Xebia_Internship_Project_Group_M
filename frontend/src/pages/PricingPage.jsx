import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export default function PricingPage() {
  const navigate = useNavigate();

  const handleBuy = async () => {
    try {
      // Step 1: Call backend to create Razorpay order
      const res = await axios.post(API_ENDPOINTS.PAYMENT_CREATE_ORDER, {
        amount: 199, // ₹199
      });

      // Step 2: Prepare Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "AutoFolio",
        description: "Pro Plan Access",
        order_id: res.data.id,

        handler: async function (response) {
          try {
            // Step 3: Call backend to activate subscription
            const token = localStorage.getItem("token");

            const activateRes = await fetch(
              API_ENDPOINTS.PAYMENT_ACTIVATE_SUBSCRIPTION,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token,
                },
                body: JSON.stringify({
                  subscriptionId: response.razorpay_order_id, // Using order ID for now
                  planId: "pro-plan-199", // Optional: set your own plan ID
                }),
              }
            );

            const data = await activateRes.json();

            if (activateRes.ok) {
              alert("✅ Payment & Activation Successful!");
              localStorage.setItem("hasPaid", "true");
              navigate("/dashboard");
            } else {
              console.error("Activation failed:", data);
              alert("Payment successful but activation failed: " + data.error);
            }
          } catch (err) {
            console.error("Error during activation:", err);
            alert("Something went wrong while activating your plan.");
          }
        },

        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6366f1",
        },
      };

      // Step 4: Open Razorpay popup
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  // 🚦 Redirect if already paid
  useEffect(() => {
    const hasPaid = localStorage.getItem("hasPaid");
    if (hasPaid === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Buy a Plan</h1>
        <p className="mb-6 text-gray-600">One-time payment to unlock portfolio features.</p>
        <div className="text-4xl font-bold mb-6">₹199</div>
        <Button className="text-lg px-6 py-2" onClick={handleBuy}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
