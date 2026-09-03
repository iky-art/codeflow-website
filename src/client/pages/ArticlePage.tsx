import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { apiClient } from "../lib/apiClient";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  useEffect(() => {
    if (slug) apiClient.get(`/api/articles/${slug}`).then(setArticle);
  }, [slug]);
  if (!article) return <><Navbar /><main className="container" style={{ padding: "var(--space-6) 0" }}>Memuat...</main></>;
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>{article.title}</h1>
        <p style={{ whiteSpace: "pre-wrap" }}>{article.content}</p>
      </main>
    </>
  );
}
