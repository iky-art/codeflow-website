import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { Button } from "../components/Button/Button";
import { apiClient } from "../lib/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any>(null);

  useEffect(() => {
    apiClient.get("/api/profile").then(setProfile);
    apiClient.get<any[]>("/api/chat").then(setChats);
    apiClient.get("/api/schedule").then(setSchedule);
  }, []);

  async function newChat() {
    const res = await apiClient.post<{ id: string }>("/api/chat", { title: "New Chat" });
    navigate(`/chat/${res.id}`);
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Welcome back, {user?.name}</h1>

        {schedule?.today && (
          <Card style={{ marginBottom: "var(--space-5)" }}>
            <CardTitle>Today's Subject</CardTitle>
            <CardBody>{schedule.today.subject}</CardBody>
          </Card>
        )}

        {profile && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
            <Card><CardTitle>XP</CardTitle><CardBody>{profile.xp}</CardBody></Card>
            <Card><CardTitle>Level</CardTitle><CardBody>{profile.level}</CardBody></Card>
            <Card><CardTitle>Streak</CardTitle><CardBody>{profile.streak} hari</CardBody></Card>
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}>
          <Link to="/learn"><Button variant="secondary">Continue Learning</Button></Link>
          <Link to="/progress"><Button variant="secondary">Progress</Button></Link>
          <Link to="/achievements"><Button variant="secondary">Achievements</Button></Link>
          <Link to="/leaderboard"><Button variant="secondary">Leaderboard</Button></Link>
          <Link to="/bookmarks"><Button variant="secondary">Bookmarks</Button></Link>
        </div>

        <h2 className="section-heading">Recent Chats</h2>
        <Button onClick={newChat} variant="primary" style={{ marginBottom: "var(--space-4)" }}>+ New Chat</Button>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {chats.length === 0 && <p>Belum ada chat.</p>}
          {chats.map((c) => (
            <Link key={c.id} to={`/chat/${c.id}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{c.title}</CardTitle>
                <CardBody>{new Date(c.updated_at).toLocaleString("id-ID")}</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
