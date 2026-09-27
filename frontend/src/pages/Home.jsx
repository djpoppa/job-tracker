import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import './Home.css';

function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <h1>Job Tracker</h1>
      <p>Keep all of your job applications organized in one place.</p>
      <ul>
        <li>Track applications</li>
        <li>Update interview status</li>
        <li>Monitor offers and rejections</li>
      </ul>

      {loading ? (
        <button className="Button" disabled>
          Loading...
        </button>
      ) : user ? (
        <Link to="/jobs" className="Button">
          View Applications
        </Link>
      ) : (
        <Link to="/login" className="Button">
          Log In
        </Link>
      )}
    </>
  );
}

export default Home;