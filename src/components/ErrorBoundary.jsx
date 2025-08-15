import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you would send this to your error tracking service
    // errorTrackingService.captureException(error, {
    //   contexts: { errorInfo }
    // })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          margin: '2rem'
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '1rem' }}>
            <summary>Error Details (for developers)</summary>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Stack Trace:</strong></p>
            <code>{this.state.errorInfo.componentStack}</code>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary