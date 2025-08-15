import React, { useState, useCallback, useMemo } from 'react'
import { useLazyImage, useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { getOptimizedImageUrl } from '../utils/performanceUtils'

// Lazy loading image component
const LazyImage = React.memo(({ src, alt, width = 300, height = 200, ...props }) => {
  const [ref, isLoaded, isIntersecting, imageSrc] = useLazyImage(src, {
    rootMargin: '100px', // Start loading 100px before image comes into view
    threshold: 0.1
  })

  return (
    <div 
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        ...props.style
      }}
    >
      {isIntersecting && !isLoaded && (
        <div className="skeleton" style={{ width: '100%', height: '100%' }} />
      )}
      
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          onLoad={() => console.log(`Image loaded: ${alt}`)}
          onError={() => console.error(`Failed to load image: ${alt}`)}
        />
      )}
      
      {!isIntersecting && (
        <div style={{ color: '#999', fontSize: '14px' }}>
          📷 {alt}
        </div>
      )}
      
      {/* Loading indicator */}
      {isIntersecting && !isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '12px'
        }}>
          Loading...
        </div>
      )}
    </div>
  )
})

// Optimized image grid component
const ImageGrid = React.memo(({ images, columns = 4 }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem',
      padding: '1rem'
    }}>
      {images.map((image, index) => (
        <LazyImage
          key={image.id}
          src={image.url}
          alt={image.title}
          width={300}
          height={200}
        />
      ))}
    </div>
  )
})

// Performance stats component
const PerformanceStats = React.memo(({ imagesLoaded, totalImages, loadTime }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 })
  
  return (
    <div 
      ref={ref}
      style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        fontSize: '0.9rem',
        border: '1px solid #e5e5e5',
        zIndex: 10,
        opacity: isVisible ? 1 : 0.8,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div><strong>Images Loaded:</strong> {imagesLoaded}/{totalImages}</div>
      <div><strong>Load Progress:</strong> {Math.round((imagesLoaded / totalImages) * 100)}%</div>
      <div><strong>Avg Load Time:</strong> {loadTime}ms</div>
      <div><strong>Network Requests:</strong> {imagesLoaded} (lazy loaded)</div>
    </div>
  )
})

const ImageGallery = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [loadTime, setLoadTime] = useState(0)
  const [columns, setColumns] = useState(4)
  const [imageQuality, setImageQuality] = useState(75)
  const [showOptimized, setShowOptimized] = useState(true)

  // Generate sample image data with placeholder service
  const images = useMemo(() => {
    const categories = ['nature', 'city', 'people', 'animals', 'food', 'abstract']
    
    return Array.from({ length: 50 }, (_, index) => {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const imageId = Math.floor(Math.random() * 1000) + 100
      
      // Use different image services for variety
      const services = [
        `https://picsum.photos/300/200?random=${imageId}`,
        `https://source.unsplash.com/300x200/?${category}&sig=${imageId}`,
        `https://loremflickr.com/300/200/${category}?random=${imageId}`
      ]
      
      const baseUrl = services[index % services.length]
      
      return {
        id: index + 1,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Image ${index + 1}`,
        url: showOptimized ? getOptimizedImageUrl(baseUrl, 300, 200, imageQuality) : baseUrl,
        category
      }
    })
  }, [imageQuality, showOptimized])

  const handleColumnsChange = useCallback((e) => {
    setColumns(parseInt(e.target.value))
  }, [])

  const handleQualityChange = useCallback((e) => {
    setImageQuality(parseInt(e.target.value))
  }, [])

  const handleOptimizedToggle = useCallback((e) => {
    setShowOptimized(e.target.checked)
  }, [])

  const resetStats = useCallback(() => {
    setImagesLoaded(0)
    setLoadTime(0)
  }, [])

  // Simulate image loading stats (in real app, this would be tracked by actual image loads)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setImagesLoaded(prev => {
        if (prev < images.length) {
          const newCount = prev + 1
          setLoadTime(Math.round(Math.random() * 500 + 200)) // Simulate load time
          return newCount
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="fade-in">
      <h1>Image Optimization & Lazy Loading</h1>
      <p>
        This gallery demonstrates lazy loading, intersection observer, and image optimization techniques
        to improve performance and reduce bandwidth usage.
      </p>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <label htmlFor="columns">Columns: </label>
          <select 
            id="columns"
            value={columns} 
            onChange={handleColumnsChange}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)'
            }}
          >
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
            <option value={5}>5 columns</option>
            <option value={6}>6 columns</option>
          </select>
        </div>

        <div>
          <label htmlFor="quality">Image Quality: </label>
          <select 
            id="quality"
            value={imageQuality} 
            onChange={handleQualityChange}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)'
            }}
          >
            <option value={50}>50% (Faster)</option>
            <option value={75}>75% (Balanced)</option>
            <option value={90}>90% (Higher Quality)</option>
            <option value={100}>100% (Original)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="optimized"
            checked={showOptimized}
            onChange={handleOptimizedToggle}
          />
          <label htmlFor="optimized">Use Optimized URLs</label>
        </div>

        <button 
          onClick={resetStats}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          Reset Stats
        </button>
      </div>

      {/* Performance Stats */}
      <PerformanceStats 
        imagesLoaded={imagesLoaded}
        totalImages={images.length}
        loadTime={loadTime}
      />

      {/* Image Grid */}
      <ImageGrid images={images} columns={columns} />

      {/* Optimization Information */}
      <div style={{ 
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h3>Image Optimization Techniques Demonstrated:</h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          <div>
            <h4>🚀 Lazy Loading</h4>
            <ul>
              <li>Images load only when they enter the viewport</li>
              <li>Reduces initial page load time</li>
              <li>Saves bandwidth for users who don't scroll</li>
              <li>Uses Intersection Observer API for efficiency</li>
            </ul>
          </div>

          <div>
            <h4>🎯 Intersection Observer</h4>
            <ul>
              <li>Monitors element visibility efficiently</li>
              <li>100px margin for preloading before visible</li>
              <li>Better performance than scroll event listeners</li>
              <li>Automatic cleanup on component unmount</li>
            </ul>
          </div>

          <div>
            <h4>📐 Image Optimization</h4>
            <ul>
              <li>Responsive image sizing</li>
              <li>Quality adjustment for bandwidth optimization</li>
              <li>Format optimization (WebP when supported)</li>
              <li>CDN integration for faster delivery</li>
            </ul>
          </div>

          <div>
            <h4>⚡ Performance Benefits</h4>
            <ul>
              <li>Reduced initial bundle size</li>
              <li>Lower memory usage</li>
              <li>Improved Core Web Vitals scores</li>
              <li>Better user experience on slow networks</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '4px'
        }}>
          <h4>💡 Pro Tips:</h4>
          <ul>
            <li>Use appropriate image formats (WebP, AVIF) with fallbacks</li>
            <li>Implement progressive image loading with blurred placeholders</li>
            <li>Consider using a CDN with automatic optimization</li>
            <li>Monitor Core Web Vitals, especially Largest Contentful Paint (LCP)</li>
            <li>Use skeleton screens for better perceived performance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

LazyImage.displayName = 'LazyImage'
ImageGrid.displayName = 'ImageGrid'
PerformanceStats.displayName = 'PerformanceStats'

export default ImageGallery