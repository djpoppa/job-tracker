const API_URL = import.meta.env.VITE_API_URL;

let csrfToken = null;

async function getCsrfToken() {
    if (csrfToken) {
        return csrfToken;
    }

    const response = await fetch(`${API_URL}/auth/csrf`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Unable to obtain CSRF token: ${response.status}`
        );
    }

    const text = await response.text();

    if (!text) {
        throw new Error("CSRF endpoint returned an empty response");
    }

    const data = JSON.parse(text);

    csrfToken = data.token;

    return csrfToken;
}

export async function apiRequest(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();

    const headers = new Headers(options.headers);

    const isAuthRequest =
        endpoint === "/auth/login" ||
        endpoint === "/auth/register";

    const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);

    if (!isAuthRequest && !isSafeMethod) {
        const token = await getCsrfToken();

        headers.set("X-XSRF-TOKEN", token);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    });

    if (!response.ok) {
        let message = `API request failed: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }
        } catch {
            // Response wasn't JSON
        }

        throw new Error(message);
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}