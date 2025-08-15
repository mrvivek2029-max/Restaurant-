import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import { throttle } from '../utils/performanceUtils'

// Generate large dataset for performance testing
const generateLargeDataset = (size) => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Automotive']
  const statuses = ['Active', 'Inactive', 'Pending', 'Archived']
  
  return Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    value: Math.floor(Math.random() * 1000) + 10,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: `This is a description for item ${index + 1} with some additional text to make it longer.`
  }))
}

// Virtual list row component (memoized for performance)
const VirtualRow = React.memo(({ index, style, data }) => {
  const item = data[index]
  
  return (
    <div 
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e5e5',
        backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
      }}
    >
      <div style={{ flex: '0 0 60px', fontWeight: 'bold' }}>{item.id}</div>
      <div style={{ flex: '1 1 200px', marginRight: '1rem' }}>{item.name}</div>
      <div style={{ flex: '0 0 100px', marginRight: '1rem' }}>{item.category}</div>
      <div style={{ flex: '0 0 80px', marginRight: '1rem', textAlign: 'right' }}>${item.value}</div>
      <div style={{ 
        flex: '0 0 80px', 
        marginRight: '1rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        textAlign: 'center',
        backgroundColor: item.status === 'Active' ? '#d4edda' : 
                        item.status === 'Inactive' ? '#f8d7da' : 
                        item.status === 'Pending' ? '#fff3cd' : '#e2e3e5',
        color: item.status === 'Active' ? '#155724' : 
               item.status === 'Inactive' ? '#721c24' : 
               item.status === 'Pending' ? '#856404' : '#6c757d'
      }}>
        {item.status}
      </div>
      <div style={{ flex: '0 0 100px', marginRight: '1rem' }}>{item.date}</div>
      <div style={{ flex: '1 1 300px', fontSize: '0.9rem', color: '#666' }}>
        {item.description}
      </div>
    </div>
  )
})

// Performance metrics component
const PerformanceMetrics = React.memo(({ dataSize, renderTime, scrollPosition }) => (
  <div style={{
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    fontSize: '0.9rem',
    zIndex: 10
  }}>
    <div><strong>Items:</strong> {dataSize.toLocaleString()}</div>
    <div><strong>Render Time:</strong> {renderTime}ms</div>
    <div><strong>Scroll Position:</strong> {scrollPosition}px</div>
    <div><strong>Memory Usage:</strong> {
      performance.memory ? 
      `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 
      'N/A'
    }</div>
  </div>
))

const DataVisualization = () => {
  const [dataSize, setDataSize] = useState(10000)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [renderTime, setRenderTime] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const listRef = useRef(null)

  // Generate data based on size
  const rawData = useMemo(() => {
    const start = performance.now()
    const data = generateLargeDataset(dataSize)
    const end = performance.now()
    setRenderTime(Math.round(end - start))
    return data
  }, [dataSize])

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = rawData

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [rawData, filterCategory, searchTerm])

  // Throttled scroll handler for performance
  const handleScroll = useCallback(
    throttle(({ scrollOffset }) => {
      setScrollPosition(Math.round(scrollOffset))
    }, 100),
    []
  )

  const handleDataSizeChange = useCallback((e) => {
    setDataSize(parseInt(e.target.value))
  }, [])

  const handleCategoryChange = useCallback((e) => {
    setFilterCategory(e.target.value)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToItem(0)
  }, [])

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(filteredData.length - 1)
  }, [filteredData.length])

  return (
    <div className="fade-in">
      <h1>Virtual Scrolling & Large Dataset Performance</h1>
      <p>
        This page demonstrates efficient rendering of large datasets using virtual scrolling. 
        Only visible items are rendered to maintain smooth performance.
      </p>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label htmlFor="dataSize">Dataset Size: </label>
          <select 
            id="dataSize"
            value={dataSize} 
            onChange={handleDataSizeChange}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)'
            }}
          >
            <option value={1000}>1,000 items</option>
            <option value={10000}>10,000 items</option>
            <option value={50000}>50,000 items</option>
            <option value={100000}>100,000 items</option>
          </select>
        </div>

        <div>
          <label htmlFor="category">Category: </label>
          <select 
            id="category"
            value={filterCategory} 
            onChange={handleCategoryChange}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)'
            }}
          >
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
            <option value="Automotive">Automotive</option>
          </select>
        </div>

        <div>
          <label htmlFor="search">Search: </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search items..."
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)',
              minWidth: '200px'
            }}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={scrollToTop}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ↑ Top
          </button>
          <button 
            onClick={scrollToBottom}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ↓ Bottom
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics 
        dataSize={filteredData.length}
        renderTime={renderTime}
        scrollPosition={scrollPosition}
      />

      {/* Virtual List Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        height: '40px',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        fontWeight: 'bold',
        position: 'sticky',
        top: '120px',
        zIndex: 5
      }}>
        <div style={{ flex: '0 0 60px' }}>ID</div>
        <div style={{ flex: '1 1 200px', marginRight: '1rem' }}>Name</div>
        <div style={{ flex: '0 0 100px', marginRight: '1rem' }}>Category</div>
        <div style={{ flex: '0 0 80px', marginRight: '1rem', textAlign: 'right' }}>Value</div>
        <div style={{ flex: '0 0 80px', marginRight: '1rem', textAlign: 'center' }}>Status</div>
        <div style={{ flex: '0 0 100px', marginRight: '1rem' }}>Date</div>
        <div style={{ flex: '1 1 300px' }}>Description</div>
      </div>

      {/* Virtual List */}
      <div style={{ 
        height: '600px', 
        border: '1px solid var(--border-color)',
        borderRadius: '0 0 8px 8px'
      }}>
        <List
          ref={listRef}
          height={600}
          itemCount={filteredData.length}
          itemSize={60}
          itemData={filteredData}
          onScroll={handleScroll}
          overscanCount={10} // Render 10 extra items for smoother scrolling
        >
          {VirtualRow}
        </List>
      </div>

      {/* Performance Tips */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px'
      }}>
        <h3>Virtual Scrolling Performance Benefits:</h3>
        <ul>
          <li><strong>Memory Efficiency:</strong> Only renders visible items, reducing DOM nodes</li>
          <li><strong>Smooth Scrolling:</strong> Maintains 60fps even with 100,000+ items</li>
          <li><strong>Fast Filtering:</strong> Operations work on data arrays, not DOM elements</li>
          <li><strong>Consistent Performance:</strong> Render time stays constant regardless of dataset size</li>
          <li><strong>Reduced Bundle Size:</strong> react-window is lighter than full data grid solutions</li>
        </ul>
        
        <h4>Without Virtual Scrolling:</h4>
        <p>
          Rendering {filteredData.length.toLocaleString()} DOM elements would create significant 
          performance issues, including high memory usage, slow scrolling, and browser freezing.
        </p>
      </div>
    </div>
  )
}

VirtualRow.displayName = 'VirtualRow'
PerformanceMetrics.displayName = 'PerformanceMetrics'

export default DataVisualization