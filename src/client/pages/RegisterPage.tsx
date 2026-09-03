import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input/Input";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";
import "./auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const navigate = useNavigate();

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await apiClient.post("/api/auth/register", form);
      await refresh();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      if (err.fieldErrors) {
        const mapped: Record<string, string> = {};
        for (const fe of err.fieldErrors) mapped[fe.field] = fe.message;
        setFieldErrors(mapped);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">Daftar</div>
        <div className="auth-subtitle">Mulai belajar coding hari ini.</div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <Input label="Nama" value={form.name} onChange={(e) => update("name", e.target.value)} error={fieldErrors.name} required />
          <Input label="Username" value={form.username} onChange={(e) => update("username", e.target.value)} error={fieldErrors.username} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={fieldErrors.email} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} error={fieldErrors.password} required />
          <Input label="Konfirmasi Password" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} error={fieldErrors.confirmPassword} required />
          <Button type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>
        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </div>
      </div>
    </div>
  );
}
