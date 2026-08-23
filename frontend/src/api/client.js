const API_URL = import.meta.env.VITE_API_URL;

function getCsrfToken() {
    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="));

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(
        cookie.substring("XSRF-TOKEN=".length)
    );
}

export async function apiRequest(endpoint, options = {}) {
    const method = (options.method || "GET").toUpperCase();

    const headers = new Headers(options.headers);

    const isAuthRequest =
        endpoint === "/auth/login" ||
        endpoint === "/auth/register";

    if (
        !isAuthRequest &&
        !["GET", "HEAD", "OPTIONS"].includes(method)
    ) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            headers.set("X-XSRF-TOKEN", csrfToken);
        }
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