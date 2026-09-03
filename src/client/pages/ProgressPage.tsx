import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function ProgressPage() {
  const [progress, setProgress] = useState<any>(null);
  useEffect(() => {
    apiClient.get("/api/progress").then(setProgress);
  }, []);
  if (!progress) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Progress</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-3)" }}>
          <Card><CardTitle>Lessons</CardTitle><CardBody>{progress.lessonsCompleted} selesai</CardBody></Card>
          <Card><CardTitle>Challenges</CardTitle><CardBody>{progress.challengesSolved} solved</CardBody></Card>
          <Card><CardTitle>Quiz Accuracy</CardTitle><CardBody>{progress.quizAccuracy}%</CardBody></Card>
        </div>
      </main>
    </>
  );
}
