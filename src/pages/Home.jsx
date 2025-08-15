import React, { memo } from 'react'
import { performanceMark, performanceMeasure } from '../utils/performanceUtils'

const Home = memo(() => {
  // Mark performance for component render
  performanceMark('home-render-start')

  React.useEffect(() => {
    performanceMark('home-render-end')
    const renderTime = performanceMeasure('home-render-time', 'home-render-start', 'home-render-end')
    console.log(`Home component render time: ${renderTime}ms`)
  }, [])

  return (
    <div className="fade-in">
      <h1>Performance Optimization Demo</h1>
      <p>
        This application demonstrates various performance optimization techniques for web applications,
        focusing on bundle size reduction, load time improvements, and runtime optimizations.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginTop: '2rem' 
      }}>
        <OptimizationCard
          title="Code Splitting & Lazy Loading"
          description="Components are loaded on-demand to reduce initial bundle size"
          techniques={[
            'React.lazy() for component splitting',
            'Dynamic imports for libraries',
            'Route-based code splitting',
            'Intersection observer for lazy loading'
          ]}
        />
        
        <OptimizationCard
          title="Bundle Optimization"
          description="Minimize bundle size through various optimization techniques"
          techniques={[
            'Tree shaking unused code',
            'Code minification and compression',
            'Chunk splitting strategies',
            'Library replacement (moment → date-fns)'
          ]}
        />
        
        <OptimizationCard
          title="Runtime Performance"
          description="Optimize component rendering and user interactions"
          techniques={[
            'React.memo for component memoization',
            'useMemo and useCallback hooks',
            'Virtual scrolling for large lists',
            'Debounced search and inputs'
          ]}
        />
        
        <OptimizationCard
          title="Asset Optimization"
          description="Optimize images and other static assets"
          techniques={[
            'Lazy loading images',
            'WebP format with fallbacks',
            'Responsive image sizing',
            'CDN and caching strategies'
          ]}
        />
      </div>
      
      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Performance Monitoring</h2>
        <p>
          This demo includes real-time performance monitoring using the Web Vitals API.
          Click the performance monitor button (📊) in the bottom right to view metrics.
        </p>
        <ul>
          <li><strong>First Contentful Paint (FCP):</strong> Time to first content render</li>
          <li><strong>Largest Contentful Paint (LCP):</strong> Time to largest content render</li>
          <li><strong>Cumulative Layout Shift (CLS):</strong> Visual stability measurement</li>
          <li><strong>First Input Delay (FID):</strong> Interactivity responsiveness</li>
          <li><strong>Memory Usage:</strong> JavaScript heap memory consumption</li>
        </ul>
      </div>
    </div>
  )
})

// Memoized card component to prevent unnecessary re-renders
const OptimizationCard = memo(({ title, description, techniques }) => (
  <div style={{
    padding: '1.5rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>{title}</h3>
    <p style={{ marginBottom: '1rem', color: '#666' }}>{description}</p>
    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
      {techniques.map((technique, index) => (
        <li key={index} style={{ marginBottom: '0.5rem' }}>{technique}</li>
      ))}
    </ul>
  </div>
))

Home.displayName = 'Home'
OptimizationCard.displayName = 'OptimizationCard'

export default Home