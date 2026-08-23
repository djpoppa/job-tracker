import { apiRequest } from "./client";

export async function login(email, password) {
    return apiRequest("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function register(email, password) {
    return apiRequest("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function logout() {
    return apiRequest("/auth/logout", {
        method: "POST",
    });
}

export async function getCurrentUser() {
    return apiRequest("/auth/me", {
        method: "GET",
    });
}