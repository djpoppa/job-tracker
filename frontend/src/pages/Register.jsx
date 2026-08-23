import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await register(email, password);
            navigate("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>

            <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="Email"
                required
                disabled={isLoading}
            />

            <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
            />

            <input
                type="password"
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                placeholder="Confirm Password"
                required
                disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
            </button>

            {error && <p>{error}</p>}

            <p>
                Already have an account?{" "}
                <Link to="/login">Log in</Link>
            </p>
        </form>
    );
}

export default Register;