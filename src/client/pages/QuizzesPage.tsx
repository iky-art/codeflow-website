import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/quizzes").then(setQuizzes);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Quiz</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {quizzes.map((q) => (
            <Link key={q.id} to={`/quiz/${q.id}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{q.title}</CardTitle>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
