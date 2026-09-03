import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";
import { CodeBlock } from "../components/CodeBlock/CodeBlock";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";
import "./HomePage.css";

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function HomePage() {
  const [week, setWeek] = useState<{ day_of_week: number; subject: string }[]>([]);
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    apiClient
      .get<{ today: any; week: any[] }>("/api/schedule")
      .then((res) => {
        setWeek(res.week);
        setTodayIndex(res.today?.day_of_week ?? new Date().getDay());
      })
      .catch(() => {
        // Schedule not seeded yet — hero/rest of the page still works fine.
        setTodayIndex(new Date().getDay());
      });
  }, []);
  return (
    <>
      <Navbar />
      <main>
        <section className="container hero">
          <div>
            <h1 className="hero-title">
              Belajar coding,
              <br />
              langsung mulai bikin sesuatu.
            </h1>
            <p className="hero-tagline">Learn. Code. Build.</p>
            <p className="hero-desc">
              Course terstruktur, roadmap yang jelas, dan coding challenge harian —
              semua dalam satu platform yang dirancang untuk pemula sampai siap kerja.
            </p>
            <div className="hero-actions">
              <Button variant="primary">Mulai Belajar</Button>
              <Button variant="secondary">Lihat Roadmap</Button>
            </div>
          </div>
          <div className="hero-terminal">
            <CodeBlock filename="hari-ini.ts">
              {`const belajar = () => {
  return "mulai sekarang";
};`}
            </CodeBlock>
          </div>
        </section>

        <section className="container">
          <h2 className="section-heading">Jadwal Minggu Ini</h2>
          <div className="schedule-strip">
            {week.length === 0 && <p>Jadwal belum diatur admin.</p>}
            {week.map((d) => (
              <div key={d.day_of_week} className={`schedule-day ${d.day_of_week === todayIndex ? "schedule-day-today" : ""}`}>
                <div className="schedule-day-label">{DAY_LABELS[d.day_of_week]}</div>
                <div className="schedule-day-subject">{d.subject}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="container">
          <h2 className="section-heading">Kenapa CodeFlow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
            <Card>
              <CardTitle>Roadmap Jelas</CardTitle>
              <CardBody>Frontend, Backend, Mobile, AI — tahu persis harus belajar apa berikutnya.</CardBody>
            </Card>
            <Card>
              <CardTitle>Challenge Harian</CardTitle>
              <CardBody>Latihan coding tiap hari, dari Easy sampai Expert, dengan hint kalau stuck.</CardBody>
            </Card>
            <Card>
              <CardTitle>Progress Terukur</CardTitle>
              <CardBody>XP, level, dan streak biar konsisten belajar — bukan cuma niat doang.</CardBody>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
