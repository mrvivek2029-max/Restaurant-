import React, { memo } from 'react'
import './About.css'

const About: React.FC = memo(() => {
  return (
    <div className="about">
      <h2>About This App</h2>
      <p>This is a performance-optimized React application built with modern best practices.</p>
      
      <div className="tech-stack">
        <h3>Technology Stack:</h3>
        <ul>
          <li><strong>Frontend:</strong> React 18 with TypeScript</li>
          <li><strong>Build Tool:</strong> Vite for fast development and optimized builds</li>
          <li><strong>Routing:</strong> React Router with code splitting</li>
          <li><strong>Performance:</strong> PWA, compression, and bundle optimization</li>
        </ul>
      </div>
      
      <div className="performance-tips">
        <h3>Performance Tips Implemented:</h3>
        <ul>
          <li>Lazy loading of components and routes</li>
          <li>Memoization to prevent unnecessary re-renders</li>
          <li>Code splitting for smaller initial bundle</li>
          <li>Service worker for offline capabilities</li>
          <li>Compression for faster downloads</li>
        </ul>
      </div>
    </div>
  )
})

About.displayName = 'About'

export default About