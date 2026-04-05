// utils/api.js

const BASE_URL = "http://localhost:5000/api";

const apiRequest = async ({
    endpoint,
    method = "GET",
    body = null,
    headers = {},
}) => {
    const isFormData = body instanceof FormData;

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...headers,
            },
            body: body ? (isFormData ? body : JSON.stringify(body)) : null,
            credentials: "include",
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }

        return await res.json();
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

export const api = {
    get: (endpoint) => apiRequest({ endpoint }),

    post: (endpoint, body) => apiRequest({ endpoint, method: "POST", body }),

    put: (endpoint,body) => apiRequest({ endpoint, method: "PUT" , body}),

    delete: (endpoint) => apiRequest({ endpoint, method: "DELETE" }),
};
