import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/challenges").then(setChallenges);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Coding Challenges</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {challenges.map((c) => (
            <Link key={c.id} to={`/challenge/${c.slug}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{c.title} · {c.difficulty}</CardTitle>
                <CardBody>+{c.xp_reward} XP</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
