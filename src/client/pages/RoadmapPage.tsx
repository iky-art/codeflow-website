import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { apiClient } from "../lib/apiClient";

export default function RoadmapPage() {
  const { slug } = useParams();
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    if (slug) apiClient.get(`/api/roadmaps/${slug}`).then(setRoadmap);
  }, [slug]);

  if (!roadmap) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{roadmap.title}</h1>
        <p>{roadmap.description}</p>
        <ol style={{ color: "var(--text-muted)" }}>
          {roadmap.items?.map((item: any) => (
            <li key={item.id} style={{ marginBottom: "var(--space-2)" }}>
              {item.title}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
