import type { User } from "@/types/wallet"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface LoginResponse {
    message: string
    user: User
}

interface RegisterResponse {
    message: string
    user: User
}

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = "ApiError"
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.text()
        throw new ApiError(response.status, error)
    }

    // Get the content type
    const contentType = response.headers.get("content-type")
    
    // If it's JSON, parse it
    if (contentType?.includes("application/json")) {
        return response.json()
    }
    
    // If it's plain text, return it as a message object
    const text = await response.text()
    return { message: text } as T
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await handleResponse<{ message: string }>(response)
    
    // Create a simple user object since backend only returns a message
    const user: User = {
        id: email, // Using email as ID
        email,
        balance: 0, // This will be updated when we implement balance endpoint
    }

    return { message: data.message, user }
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    const data = await handleResponse<{ message: string }>(response)
    
    // Create a simple user object since backend only returns a message
    const user: User = {
        id: email, // Using email as ID
        email,
        balance: 0, // This will be updated when we implement balance endpoint
    }

    return { message: data.message, user }
}

// Helper function to get auth headers - now just using email/password
function getAuthHeaders(email: string, password: string): HeadersInit {
    return {
        "Content-Type": "application/json",
        "X-User-Email": email,
        "X-User-Password": password,
    }
}

// Add more API functions here as needed
// For example:
// export async function getUserBalance(email: string, password: string): Promise<{ balance: number }> {
//     const response = await fetch(`${API_BASE_URL}/users/balance`, {
//         headers: getAuthHeaders(email, password),
//     })
//     return handleResponse(response)
// } 