import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// Lazy load components for code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Performance Optimized App</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </header>
        
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App