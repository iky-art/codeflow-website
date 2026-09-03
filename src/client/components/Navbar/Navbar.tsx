import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

const links = [
  { href: "/learn", label: "Belajar" },
  { href: "/roadmaps", label: "Roadmap" },
  { href: "/challenges", label: "Challenge" },
  { href: "/articles", label: "Artikel" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          CodeFlow
        </Link>
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link to={l.href} className="navbar-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar-actions">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Button variant="ghost" onClick={() => navigate("/admin")}>
                  Admin
                </Button>
              )}
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Masuk
              </Button>
              <Button variant="primary" onClick={() => navigate("/register")}>
                Mulai Belajar
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
