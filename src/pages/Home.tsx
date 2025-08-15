import React, { memo, useMemo } from 'react'
import './Home.css'

// Memoized component to prevent unnecessary re-renders
const Home: React.FC = memo(() => {
  // Use useMemo for expensive calculations
  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString()
  }, [])

  return (
    <div className="home">
      <h2>Welcome to the Performance Optimized App</h2>
      <p>Current time: {currentTime}</p>
      <div className="features">
        <h3>Performance Features:</h3>
        <ul>
          <li>✅ Code splitting with React.lazy()</li>
          <li>✅ Bundle optimization with Vite</li>
          <li>✅ Gzip and Brotli compression</li>
          <li>✅ PWA support with service worker</li>
          <li>✅ Memoized components</li>
          <li>✅ Optimized CSS animations</li>
        </ul>
      </div>
    </div>
  )
})

Home.displayName = 'Home'

export default Home