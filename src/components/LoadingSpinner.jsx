import React from 'react'

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  const spinnerStyle = {
    display: 'inline-block',
    width: `${size}px`,
    height: `${size}px`,
    border: '3px solid #f3f3f3',
    borderTop: '3px solid var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    // Use transform3d for GPU acceleration
    transform: 'translateZ(0)',
    willChange: 'transform'
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '200px'
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} aria-label="Loading"></div>
      {message && <p style={{ marginTop: '1rem', color: '#666' }}>{message}</p>}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg) translateZ(0); }
          100% { transform: rotate(360deg) translateZ(0); }
        }
      `}</style>
    </div>
  )
}

export default React.memo(LoadingSpinner)