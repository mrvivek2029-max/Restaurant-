import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for intersection observer
 * Useful for lazy loading, infinite scroll, and viewport-based optimizations
 * 
 * @param {Object} options - Intersection observer options
 * @returns {Array} - [ref, isIntersecting, entry]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState(null)
  const elementRef = useRef(null)

  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    ...restOptions
  } = options

  useEffect(() => {
    const element = elementRef.current
    
    // Early return if element is not available or intersection observer is not supported
    if (!element || !window.IntersectionObserver) {
      return
    }

    const observerParams = {
      threshold,
      root,
      rootMargin,
      ...restOptions
    }

    const observer = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting
      
      setEntry(entry)
      
      if (!freezeOnceVisible || !isIntersecting) {
        setIsIntersecting(isElementIntersecting)
      }

      // If freezeOnceVisible and element is intersecting, disconnect observer
      if (freezeOnceVisible && isElementIntersecting) {
        observer.disconnect()
      }
    }, observerParams)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [
    threshold,
    root,
    rootMargin,
    freezeOnceVisible,
    isIntersecting // Include isIntersecting for freezeOnceVisible logic
  ])

  return [elementRef, isIntersecting, entry]
}

/**
 * Custom hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {Object} options - Intersection observer options
 * @returns {Array} - [ref, isLoaded, isIntersecting]
 */
export function useLazyImage(src, options = {}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const [ref, isIntersecting] = useIntersectionObserver({
    freezeOnceVisible: true,
    ...options
  })

  useEffect(() => {
    if (isIntersecting && src && !imageSrc) {
      // Start loading the image
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`)
        setIsLoaded(false)
      }
      img.src = src
    }
  }, [isIntersecting, src, imageSrc])

  return [ref, isLoaded, isIntersecting, imageSrc]
}