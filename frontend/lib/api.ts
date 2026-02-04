
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
    constructor(public status: number, public statusText: string, public data: any) {
        super(`API Error ${status}: ${statusText}`);
    }
}

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: 'Unknown error occurred' };
        }
        throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

/**
 * Car Service to interact with Backend
 */
export const carService = {
    getAll: (skip = 0, limit = 100) => 
        fetchJson<any[]>(`/cars?skip=${skip}&limit=${limit}`),
    
    getTrending: (limit = 10) =>
        fetchJson<any[]>(`/cars/trending?limit=${limit}`),

    getById: (id: string) => 
        fetchJson<any>(`/cars/${id}`),

    search: (filters: any) => 
        fetchJson<any[]>('/cars/search', {
            method: 'POST',
            body: JSON.stringify(filters),
        }),
        
    calculateTco: (id: string, params: any) =>
        fetchJson<any>(`/cars/${id}/tco`, {
            method: 'POST',
            body: JSON.stringify(params),
        }),
};

/**
 * User Service (Placeholder for now)
 */
export const userService = {
    // defined in backend/routers/users.py
    // likely post /users/ for signup
    // post /users/login for login? (Need to check doc/file later if auth is required)
};
