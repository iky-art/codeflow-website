import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import "./auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/api/auth/forgot-password", { email });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">Lupa Password</div>
        <div className="auth-subtitle">
          {sent ? "Kalau email terdaftar, instruksi reset akan dikirim." : "Masukkan email akun kamu."}
        </div>
        {!sent && (
          <form onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Mengirim..." : "Kirim Instruksi Reset"}
            </Button>
          </form>
        )}
        <div className="auth-footer">
          <Link to="/login">Kembali ke Login</Link>
        </div>
      </div>
    </div>
  );
}
