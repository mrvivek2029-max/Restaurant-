import React, { useState, useEffect } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const newMetrics = {}

      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          newMetrics[entry.name] = Math.round(entry.duration * 100) / 100
        } else if (entry.entryType === 'navigation') {
          newMetrics.domContentLoaded = Math.round(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart)
          newMetrics.loadComplete = Math.round(entry.loadEventEnd - entry.loadEventStart)
          newMetrics.firstPaint = Math.round(entry.loadEventEnd - entry.fetchStart)
        }
      })

      setMetrics(prev => ({ ...prev, ...newMetrics }))
    })

    observer.observe({ entryTypes: ['measure', 'navigation'] })

    // Monitor memory usage if available
    if ('memory' in performance) {
      const updateMemory = () => {
        setMetrics(prev => ({
          ...prev,
          memoryUsed: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
          memoryTotal: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
          memoryLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
        }))
      }

      updateMemory()
      const memoryInterval = setInterval(updateMemory, 5000)

      return () => {
        observer.disconnect()
        clearInterval(memoryInterval)
      }
    }

    return () => observer.disconnect()
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
        title="Show Performance Metrics"
      >
        📊
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <strong>Performance Metrics</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>
      
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} style={{ marginBottom: '0.25rem' }}>
          <span style={{ textTransform: 'capitalize' }}>
            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
          </span>
          <span style={{ marginLeft: '0.5rem', color: '#4ade80' }}>
            {typeof value === 'number' ? `${value}${key.includes('memory') ? ' MB' : ' ms'}` : value}
          </span>
        </div>
      ))}
      
      <div style={{ marginTop: '0.5rem', fontSize: '10px', opacity: 0.7 }}>
        Updates every 5 seconds
      </div>
    </div>
  )
}

export default React.memo(PerformanceMonitor)