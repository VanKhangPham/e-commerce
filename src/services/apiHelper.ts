/**
 * Simulates real-world network latency
 */
export async function fakeDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Helper to get or initialize data in localStorage
 */
export function getStoredData<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData))
      return defaultData
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultData
  }
}

/**
 * Helper to update data in localStorage
 */
export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}
