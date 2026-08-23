import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../auth/AuthContext";

import "./Header.css";

function Header() {
    const { darkMode, setDarkMode } = useTheme();
    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="header">
            <div className="logo">
                Job Tracker
            </div>

            <nav className="nav-links">
                <Link to="/">Home</Link>

                {!loading && user && (
                    <Link to="/jobs">Jobs</Link>
                )}

                <Link to="/resume-tools">
                    Resume Tools
                </Link>

                {!loading && (
                    user ? (
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">
                            Login
                        </Link>
                    )
                )}
            </nav>

            <button
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>
        </header>
    );
}

export default Header;