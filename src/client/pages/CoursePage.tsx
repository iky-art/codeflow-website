import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function CoursePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (slug) apiClient.get(`/api/courses/${slug}`).then(setCourse);
  }, [slug]);

  async function startLearning(lessonId?: string) {
    if (!user) return navigate("/login");
    const session = await apiClient.post<{ id: string }>("/api/learning", {
      courseId: course.id,
      lessonId: lessonId ?? null,
    });
    navigate(`/learn/${session.id}`);
  }

  if (!course) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <Button onClick={() => startLearning()}>Mulai Belajar</Button>

        {course.modules?.map((m: any) => (
          <div key={m.id} style={{ marginTop: "var(--space-6)" }}>
            <h2 className="section-heading" style={{ fontSize: "var(--text-xl)" }}>{m.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {m.lessons?.map((l: any) => (
                <Card key={l.id} interactive onClick={() => startLearning(l.id)} style={{ cursor: "pointer" }}>
                  <CardTitle>{l.title}</CardTitle>
                  <CardBody>{l.difficulty} · +{l.xp_reward} XP · {l.estimated_minutes} menit</CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
