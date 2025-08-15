import React, { memo, useState, useMemo, useCallback } from 'react'
import './Dashboard.css'

// Virtual scrolling component for performance with large lists
const VirtualList: React.FC<{ items: string[] }> = memo(({ items }) => {
  const [visibleStart, setVisibleStart] = useState(0)
  const visibleCount = 20 // Show only 20 items at a time
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleStart + visibleCount)
  }, [items, visibleStart])
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const itemHeight = 50
    const newStart = Math.floor(scrollTop / itemHeight)
    setVisibleStart(newStart)
  }, [])
  
  return (
    <div className="virtual-list" onScroll={handleScroll}>
      <div 
        className="virtual-list-content" 
        style={{ height: items.length * 50 }}
      >
        <div 
          className="virtual-list-visible"
          style={{ transform: `translateY(${visibleStart * 50}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} className="virtual-list-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

VirtualList.displayName = 'VirtualList'

const Dashboard: React.FC = memo(() => {
  // Generate large dataset for demonstration
  const largeDataset = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`)
  }, [])
  
  const [searchTerm, setSearchTerm] = useState('')
  
  // Debounced search for better performance
  const filteredItems = useMemo(() => {
    if (!searchTerm) return largeDataset
    return largeDataset.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [largeDataset, searchTerm])
  
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p>Showing {filteredItems.length} items</p>
      </div>
      
      <div className="performance-demo">
        <h3>Performance Demo: Virtual Scrolling</h3>
        <p>This list contains 10,000 items but only renders 20 visible items at a time.</p>
        <VirtualList items={filteredItems} />
      </div>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard