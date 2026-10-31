/**
 * HTTP Client for NOVA Commerce REST API
 * Automatically handles JWT authentication, error handling, and JSON responses.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_API_BASE_URL || import.meta.env?.VITE_API_URL)) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:5000/api')

interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class HttpError extends Error {
  public statusCode: number
  public errors?: unknown[]

  constructor(message: string, statusCode: number, errors?: unknown[]) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

export function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('nova_auth_session')
    if (!raw) return null
    const session = JSON.parse(raw)
    return session.token || null
  } catch {
    return null
  }
}

export async function httpClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; pagination?: ApiResponse['pagination']; message?: string }> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers = new Headers(options.headers || {})

  // Set default Content-Type if not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Attach Bearer Token if available
  const token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null as unknown as T }
    }

    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    if (!isJson) {
      if (!response.ok) {
        throw new HttpError(`Lỗi máy chủ (${response.status})`, response.status)
      }
      return { data: null as unknown as T }
    }

    const json: ApiResponse<T> = await response.json()

    if (!response.ok || json.success === false) {
      const errorMsg = json.message || `Lỗi máy chủ (${response.status})`
      throw new HttpError(errorMsg, response.status, json.data as unknown[])
    }

    return {
      data: json.data,
      pagination: json.pagination,
      message: json.message,
    }
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }

    // Network error (e.g. backend server offline)
    console.warn(`[HTTP Client] Không thể kết nối tới backend tại ${url}:`, error)
    throw new HttpError(
      'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
      0
    )
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    httpClient<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    httpClient<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    httpClient<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    httpClient<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    httpClient<T>(endpoint, { method: 'DELETE', ...options }),
}
