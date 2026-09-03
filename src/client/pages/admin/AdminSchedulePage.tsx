import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { apiClient } from "../../lib/apiClient";

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<Record<number, string>>({});

  useEffect(() => {
    apiClient.get<any[]>("/api/admin/schedule").then((rows) => {
      const map: Record<number, string> = {};
      for (const r of rows) map[r.day_of_week] = r.subject;
      setSchedule(map);
    });
  }, []);

  async function save(day: number) {
    await apiClient.put("/api/admin/schedule", { day_of_week: day, subject: schedule[day] || "" });
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Weekly Schedule</h1>
        {DAYS.map((label, day) => (
          <div key={day} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end", marginBottom: "var(--space-3)" }}>
            <Input
              label={label}
              value={schedule[day] || ""}
              onChange={(e) => setSchedule((s) => ({ ...s, [day]: e.target.value }))}
            />
            <Button variant="secondary" onClick={() => save(day)}>Simpan</Button>
          </div>
        ))}
      </main>
    </>
  );
}
