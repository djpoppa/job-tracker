import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import "./Header.css";

function Header() {
    const { darkMode, setDarkMode } = useTheme();

    return (
    <header className="header">
      <div className="logo">
        Job Tracker
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/resume-tools">
          Resume Tools
        </Link>
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