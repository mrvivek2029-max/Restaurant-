import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Performance monitoring
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Measure and log performance metrics
const logPerformanceMetrics = (metric) => {
  console.log(`${metric.name}: ${metric.value}ms`);
  
  // In production, you would send this to your analytics service
  // analytics.track('Web Vital', {
  //   name: metric.name,
  //   value: metric.value,
  //   id: metric.id,
  //   delta: metric.delta
  // });
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Start performance monitoring
reportWebVitals(logPerformanceMetrics);