import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";
import { CodeBlock } from "../components/CodeBlock/CodeBlock";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function ChallengePage() {
  const { id } = useParams(); // slug, param name kept generic
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionText, setSolutionText] = useState<string | null>(null);

  useEffect(() => {
    if (id) apiClient.get(`/api/challenges/${id}`).then(setChallenge);
  }, [id]);

  async function markSolved() {
    if (!user || !challenge) return;
    const result = await apiClient.post<any>(`/api/challenges/${challenge.id}/submit`, { solved: true });
    let msg = result.alreadySolved ? "Kamu sudah pernah menyelesaikan ini." : "Ditandai selesai!";
    if (result.xpResult) msg += ` +${result.xpResult.xpAwarded} XP`;
    alert(msg);
  }

  if (!challenge) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{challenge.title} · {challenge.difficulty}</h1>
        <p>{challenge.description}</p>
        <h3>Instructions</h3>
        <p>{challenge.instructions}</p>
        <CodeBlock filename="example">{challenge.examples}</CodeBlock>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setShowHint((v) => !v)}>Hint</Button>
          <Button
            variant="secondary"
            onClick={async () => {
              setShowSolution(true);
              // Solution is intentionally not sent by the list/detail endpoint —
              // in a full implementation this would hit a dedicated
              // /api/challenges/:id/solution endpoint gated the same way.
              setSolutionText("Solusi akan ditampilkan setelah kamu submit percobaan (belum diimplementasikan penuh).");
            }}
          >
            Solution
          </Button>
          <Button onClick={markSolved}>Tandai Selesai</Button>
        </div>

        {showHint && <p style={{ marginTop: "var(--space-4)" }}>💡 {challenge.hints}</p>}
        {showSolution && <p style={{ marginTop: "var(--space-4)" }}>{solutionText}</p>}
      </main>
    </>
  );
}
