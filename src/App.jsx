import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const DataVisualization = lazy(() => import('./pages/DataVisualization'))
const ImageGallery = lazy(() => import('./pages/ImageGallery'))

// Performance monitoring component
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor'))

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <nav style={{ 
            padding: '1rem', 
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem'
          }}>
            <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
            <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
            <Link to="/data" style={{ marginRight: '1rem' }}>Data Visualization</Link>
            <Link to="/gallery" style={{ marginRight: '1rem' }}>Image Gallery</Link>
          </nav>

          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/data" element={<DataVisualization />} />
                <Route path="/gallery" element={<ImageGallery />} />
              </Routes>
            </Suspense>
          </main>

          {/* Performance monitoring component */}
          <Suspense fallback={null}>
            <PerformanceMonitor />
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App