import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/achievements").then(setAchievements);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Achievements</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          {achievements.map((a) => (
            <Card key={a.code} style={{ opacity: a.earned ? 1 : 0.5 }}>
              <CardTitle>{a.earned ? "✅" : "⬜️"} {a.title}</CardTitle>
              <CardBody>{a.description}</CardBody>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
