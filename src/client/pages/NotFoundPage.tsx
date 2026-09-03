import { Navbar } from "../components/Navbar/Navbar";
import { Button } from "../components/Button/Button";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-8) 0", textAlign: "left" }}>
        <h1>Halaman tidak ditemukan</h1>
        <p>URL yang kamu buka tidak ada, atau sudah dipindah.</p>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Kembali ke Beranda
        </Button>
      </main>
    </>
  );
}
