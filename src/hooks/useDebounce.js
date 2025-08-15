import { useState, useEffect } from 'react'

/**
 * Custom hook for debouncing values to optimize performance
 * Useful for search inputs, API calls, and expensive calculations
 * 
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} - The debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debouncing callbacks
 * Useful for event handlers and expensive operations
 * 
 * @param {Function} callback - The callback to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {Array} deps - Dependencies array
 * @returns {Function} - The debounced callback
 */
export function useDebouncedCallback(callback, delay, deps = []) {
  const [debouncedCallback, setDebouncedCallback] = useState(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [...deps, delay])

  return debouncedCallback
}