import { Navbar } from "../components/Navbar/Navbar";

export default function NotificationsPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Notifications</h1>
        <p>Belum ada notifikasi.</p>
      </main>
    </>
  );
}
