import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/api/settings").then(setSettings);
  }, []);

  async function toggleNotifications() {
    const next = settings.notifications_enabled ? 0 : 1;
    await apiClient.patch("/api/settings", { notifications_enabled: next });
    setSettings((s: any) => ({ ...s, notifications_enabled: next }));
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Settings</h1>
        {settings && (
          <p>
            Notifications: {settings.notifications_enabled ? "Aktif" : "Nonaktif"}{" "}
            <Button variant="secondary" onClick={toggleNotifications}>Toggle</Button>
          </p>
        )}
        <Button
          variant="secondary"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </main>
    </>
  );
}
