import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";

// Route: /learn/:uuid  (backed by /api/learning/:uuid — ownership
// checked server-side; a user who isn't the owner gets 404, not the data.)
export default function LearningSessionPage() {
  const { uuid } = useParams();
  const [session, setSession] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    apiClient
      .get(`/api/learning/${uuid}`)
      .then(setSession)
      .catch(() => setNotFound(true));
  }, [uuid]);

  useEffect(() => {
    if (session?.lesson_id) {
      apiClient.get(`/api/lessons/${session.lesson_id}`).then(setLesson);
    }
  }, [session]);

  async function completeLesson() {
    if (!lesson) return;
    const result = await apiClient.post<any>(`/api/lessons/${lesson.id}/complete`);
    let msg = "Lesson selesai!";
    if (result.xpResult) msg += ` +${result.xpResult.xpAwarded} XP`;
    if (result.xpResult?.leveledUp) msg += ` — Level up ke ${result.xpResult.newLevel}!`;
    alert(msg);
  }

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: "var(--space-6) 0" }}>
          <h1>Sesi tidak ditemukan</h1>
          <p>Sesi belajar ini tidak ada, atau bukan milik akun kamu.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        {!lesson && <p>Memuat...</p>}
        {lesson && (
          <>
            <h1>{lesson.title}</h1>
            <p style={{ whiteSpace: "pre-wrap" }}>{lesson.content}</p>
            <Button onClick={completeLesson}>Tandai Selesai</Button>
          </>
        )}
      </main>
    </>
  );
}
