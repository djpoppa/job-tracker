import { apiRequest } from "./client";

export function apiGetApplications() {
    return apiRequest("/applications");
}

export function apiCreateApplication(application) {
    return apiRequest("/applications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
    });
}

export function apiUpdateApplication(id, application) {
    return apiRequest(`/applications/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
    });
}

export function apiDeleteApplication(id) {
    return apiRequest(`/applications/${id}`, {
        method: "DELETE",
    });
}