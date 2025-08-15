/**
 * Performance optimization utilities
 */

// Memoization utility for expensive calculations
export const memoize = (fn) => {
  const cache = new Map()
  
  return (...args) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, result)
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

// Throttle utility for limiting function execution frequency
export const throttle = (func, limit) => {
  let inThrottle
  
  return function() {
    const args = arguments
    const context = this
    
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Debounce utility for delaying function execution
export const debounce = (func, wait, immediate) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Lazy loading utility for dynamic imports
export const lazyLoad = (componentImport, fallbackText = 'Error loading component') => {
  return () => {
    return componentImport().catch(() => {
      // Return a simple fallback component
      return { 
        default: () => fallbackText
      }
    })
  }
}

// Performance measurement utilities
export const performanceMark = (name) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name)
  }
}

export const performanceMeasure = (name, startMark, endMark) => {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      return measure ? measure.duration : 0
    } catch (error) {
      console.warn('Performance measurement failed:', error)
      return 0
    }
  }
  return 0
}

// Bundle size optimization utilities
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export const loadCSS = (href) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = resolve
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Memory optimization utilities
export const cleanupEventListeners = (element, events) => {
  events.forEach(({ event, handler }) => {
    element.removeEventListener(event, handler)
  })
}

// Image optimization utilities
export const getOptimizedImageUrl = (src, width, height, quality = 75) => {
  // In a real application, this would integrate with an image optimization service
  // like Cloudinary, ImageKit, or a custom service
  const params = new URLSearchParams({
    w: width,
    h: height,
    q: quality,
    f: 'auto' // Auto format selection
  })
  
  return `${src}?${params.toString()}`
}

// Network optimization utilities
export const preloadResource = (href, as, type = null) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type
  document.head.appendChild(link)
}

export const prefetchResource = (href) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

// Virtual scrolling utilities
export const getVisibleRange = (scrollTop, itemHeight, containerHeight, totalItems) => {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  )
  
  return { startIndex, endIndex }
}

// Code splitting utilities
export const loadChunk = async (chunkName) => {
  try {
    const module = await import(/* webpackChunkName: "[request]" */ `../chunks/${chunkName}`)
    return module.default || module
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error)
    throw error
  }
}