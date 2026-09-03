import { FormEvent, useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Input } from "../../components/Input/Input";
import { Button } from "../../components/Button/Button";
import { Card, CardTitle } from "../../components/Card/Card";
import { apiClient } from "../../lib/apiClient";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  function load() {
    apiClient.get<any[]>("/api/admin/articles").then(setArticles);
  }
  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await apiClient.post("/api/admin/articles", { title, slug, published: true });
    setTitle("");
    load();
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Articles</h1>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end", marginBottom: "var(--space-5)" }}>
          <Input label="Judul artikel baru" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button type="submit">Tambah</Button>
        </form>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {articles.map((a) => (
            <Card key={a.id}><CardTitle>{a.title}</CardTitle></Card>
          ))}
        </div>
      </main>
    </>
  );
}
