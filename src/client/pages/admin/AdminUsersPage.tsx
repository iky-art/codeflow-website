import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { apiClient } from "../../lib/apiClient";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get<any[]>("/api/admin/users").then(setUsers);
  }, []);
  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: "var(--space-6) 0" }}>
        <h1>Users</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "var(--space-2)" }}>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>XP</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "var(--space-2)" }}>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.xp}</td>
                <td>{u.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
