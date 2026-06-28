import { Link } from "react-router-dom";

import './Home.css';

function Home() {
  return (
    <>
      <h1>Job Tracker</h1>
      <p>Keep all of your job applications organized in one place.</p>
      <ul>
        <li>Track applications</li>
        <li>Update interview status</li>
        <li>Monitor offers and rejections</li>
      </ul>
      <Link to="/jobs" className="Button">
        View Applications
      </Link>
    </>
  );
}

export default Home;