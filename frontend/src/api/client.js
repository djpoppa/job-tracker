const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);

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