import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { apiClient } from "../lib/apiClient";

export default function LeaderboardPage() {
  const [top, setTop] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/leaderboard").then(setTop);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Leaderboard</h1>
        <ol style={{ color: "var(--text-muted)" }}>
          {top.map((u) => (
            <li key={u.id} style={{ marginBottom: "var(--space-2)" }}>
              {u.username ?? u.name} — {u.xp} XP
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
