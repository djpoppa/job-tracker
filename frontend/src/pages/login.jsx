import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login, loading } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            await login(email, password);

            navigate("/jobs");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                
                <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="Email"
                    required
                    disabled={loading}
                />

                <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>

                {error && <p>{error}</p>}
            </form>
            <p>
                Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>
        </>
    );
}

export default Login;