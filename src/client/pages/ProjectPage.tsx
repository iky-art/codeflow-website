import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { apiClient } from "../lib/apiClient";

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  useEffect(() => {
    if (slug) apiClient.get(`/api/projects/${slug}`).then(setProject);
  }, [slug]);
  if (!project) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <p>{project.difficulty} · +{project.xp_reward} XP</p>
      </main>
    </>
  );
}
