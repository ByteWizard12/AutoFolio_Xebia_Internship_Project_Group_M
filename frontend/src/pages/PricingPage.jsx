//full page ADD by vaibhav 
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axios from "axios";

export default function PricingPage() {
  const navigate = useNavigate();

  const handleBuy = async () => {
    try {
      // Call backend to create Razorpay order
      const res = await axios.post(
        "http://localhost:5001/api/payment/create-order", 
        { amount: 199 } // amount in rupees
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "AutoFolio",
        description: "Pro Plan Access",
        order_id: res.data.id,
        handler: function (response) {
          alert("Payment Successful!");
          localStorage.setItem("hasPaid", "true");
          navigate("/dashboard");
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

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      alert("Payment failed");
      console.error(error);
    }
  };

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

// till this line add by vaibhav