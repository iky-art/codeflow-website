import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";
import "./auth.css";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiClient.post("/api/auth/login", { identifier, password });
      await refresh();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">Masuk</div>
        <div className="auth-subtitle">Lanjutkan progress belajar kamu di CodeFlow.</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Email atau Username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <div className="auth-footer">
          Belum punya akun? <Link to="/register">Daftar</Link><br />
          <Link to="/forgot-password">Lupa password?</Link>
        </div>
      </div>
    </div>
  );
}
