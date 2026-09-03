import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";
import { Card } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function QuizPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string }[]>([]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (id) apiClient.get(`/api/quizzes/${id}`).then(setQuiz);
  }, [id]);

  function selectAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, selected: String(optionIndex) }]);
    if (current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  }

  async function submit() {
    if (!user) return alert("Login dulu untuk submit quiz.");
    const res = await apiClient.post(`/api/quizzes/${id}/submit`, { answers });
    setResult(res);
  }

  if (!quiz) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;

  if (result) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: "var(--space-6) 0" }}>
          <h1>Hasil Quiz</h1>
          <Card>
            <p>Score: {result.score}/{result.total}</p>
            <p>XP: +{result.xpEarned}</p>
            {result.xpResult?.leveledUp && <p>🎉 Level up ke {result.xpResult.newLevel}!</p>}
          </Card>
        </main>
      </>
    );
  }

  const question = quiz.questions[current];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{quiz.title}</h1>
        <p>Question {current + 1}/{quiz.questions.length}</p>
        {question && (
          <Card>
            <p>{question.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {question.options.map((opt: string, i: number) => (
                <Button key={i} variant="secondary" onClick={() => selectAnswer(question.id, i)}>
                  {opt}
                </Button>
              ))}
            </div>
          </Card>
        )}
        {answers.length === quiz.questions.length && <Button onClick={submit}>Submit Quiz</Button>}
      </main>
    </>
  );
}
