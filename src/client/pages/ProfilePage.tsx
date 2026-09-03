import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    apiClient.get("/api/profile").then(setProfile);
  }, []);
  if (!profile) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{profile.name}</h1>
        <p>@{profile.username} · {profile.email}</p>
        <Card>
          <CardTitle>Level {profile.level}</CardTitle>
          <CardBody>{profile.xp} XP · {profile.streak} hari streak</CardBody>
        </Card>
      </main>
    </>
  );
}
