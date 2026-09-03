import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";
import type { Course } from "@shared/types";

export default function LearnPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<Course[]>("/api/courses")
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Belajar</h1>
        <p>Pilih course dan mulai belajar dari dasar.</p>
        {loading && <p>Memuat...</p>}
        {!loading && courses.length === 0 && <p>Belum ada course tersedia.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
          {courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.slug}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{c.title}</CardTitle>
                <CardBody>{c.description}</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
