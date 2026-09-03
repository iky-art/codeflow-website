import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/projects").then(setProjects);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Projects</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.slug}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{p.title}</CardTitle>
                <CardBody>{p.difficulty} · +{p.xp_reward} XP</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
