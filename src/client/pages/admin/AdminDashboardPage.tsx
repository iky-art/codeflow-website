import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Card, CardTitle } from "../../components/Card/Card";

export default function AdminDashboardPage() {
  const sections = [
    { to: "/admin/users", label: "Users" },
    { to: "/admin/courses", label: "Courses" },
    { to: "/admin/schedule", label: "Schedule" },
    { to: "/admin/articles", label: "Articles" },
  ];
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Admin</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-3)" }}>
          {sections.map((s) => (
            <Link key={s.to} to={s.to} style={{ textDecoration: "none" }}>
              <Card interactive><CardTitle>{s.label}</CardTitle></Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
