const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: UserResponse
}

export interface ErrorResponse {
  error: string
}

export async function register(data: RegisterRequest): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err: ErrorResponse = await res.json()
    throw new Error(err.error)
  }

  return res.json()
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err: ErrorResponse = await res.json()
    throw new Error(err.error)
  }

  return res.json()
}
