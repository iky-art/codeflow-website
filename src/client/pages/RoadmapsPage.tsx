import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";
import type { Roadmap } from "@shared/types";

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  useEffect(() => {
    apiClient.get<Roadmap[]>("/api/roadmaps").then(setRoadmaps);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Roadmap</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
          {roadmaps.map((r) => (
            <Link key={r.id} to={`/roadmap/${r.slug}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{r.title}</CardTitle>
                <CardBody>{r.description}</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
