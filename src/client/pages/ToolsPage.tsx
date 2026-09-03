import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Developer Tools</h1>
        <p>Kumpulan tools ringan untuk kebutuhan sehari-hari — versi lengkap menyusul.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          <Card><CardTitle>JSON Formatter</CardTitle><CardBody>Segera hadir</CardBody></Card>
          <Card><CardTitle>UUID Generator</CardTitle><CardBody>Segera hadir</CardBody></Card>
          <Card><CardTitle>Base64 Encoder/Decoder</CardTitle><CardBody>Segera hadir</CardBody></Card>
          <Card><CardTitle>Color Converter</CardTitle><CardBody>Segera hadir</CardBody></Card>
        </div>
      </main>
    </>
  );
}
