import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { Card, CardTitle, CardBody } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/articles").then(setArticles);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Artikel</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {articles.map((a) => (
            <Link key={a.id} to={`/articles/${a.slug}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <CardTitle>{a.title}</CardTitle>
                <CardBody>{a.summary}</CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
