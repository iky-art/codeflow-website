import { Navbar } from "../components/Navbar/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Tentang CodeFlow</h1>
        <p>
          CodeFlow adalah platform pembelajaran pemrograman modern — course terstruktur,
          roadmap yang jelas, coding challenge, quiz, dan gamifikasi dalam satu tempat.
        </p>
        <p className="hero-tagline">Learn. Code. Build.</p>
      </main>
    </>
  );
}
