import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { API_ENDPOINTS } from "../config/api"

export default function PortfolioPreviewPage() {
  const [previewHtml, setPreviewHtml] = useState("");
  const [finalized, setFinalized] = useState(false);
  const previewRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreview = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(API_ENDPOINTS.PORTFOLIO_GENERATE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const html = await res.text();
          setPreviewHtml(html);
        } else {
          toast({ title: "Preview failed", description: "Could not generate preview.", variant: "destructive" });
        }
      } catch (err) {
        toast({ title: "Preview failed", description: err.message, variant: "destructive" });
      }
    };
    fetchPreview();
  }, [toast]);

  const handleDownload = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.PORTFOLIO_DOWNLOAD, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast({ title: "Download failed", description: "Could not download ZIP.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Download failed", description: err.message, variant: "destructive" });
    }
  };

  const handleFinalize = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.PORTFOLIO_FINALIZE, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFinalized(true);
        toast({ title: "Portfolio finalized!", description: "Your portfolio has been saved.", duration: 3000 });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast({ title: "Finalize failed", description: "Could not finalize portfolio.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Finalize failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Portfolio Preview</h1>
          <p className="text-gray-600">Review your generated portfolio. Download or finalize when ready.</p>
        </div>
        <div ref={previewRef} className="mb-8 border rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="p-4 border-b bg-gray-100 font-semibold">Portfolio Preview</div>
          <iframe
            title="Portfolio Preview"
            srcDoc={previewHtml}
            style={{ width: "100%", minHeight: 600, border: "none" }}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleDownload} variant="outline">Download Portfolio Code (ZIP)</Button>
          <Button onClick={handleFinalize} variant="secondary" disabled={finalized}>
            {finalized ? "Finalized" : "Save/Finalize Portfolio"}
          </Button>
        </div>
      </div>
    </div>
  );
} 