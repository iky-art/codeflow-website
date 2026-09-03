import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Card } from "../components/Card/Card";
import { apiClient } from "../lib/apiClient";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/bookmarks").then(setBookmarks);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Bookmarks</h1>
        {bookmarks.length === 0 && <p>Belum ada bookmark.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {bookmarks.map((b) => (
            <Card key={`${b.target_type}-${b.target_id}`}>
              {b.target_type}: {b.target_id}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
