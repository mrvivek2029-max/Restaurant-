import React, { useState, useMemo, useCallback, memo } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { memoize } from '../utils/performanceUtils'

// Expensive calculation function (memoized)
const expensiveCalculation = memoize((data) => {
  console.log('Performing expensive calculation...')
  // Simulate expensive operation
  let result = 0
  for (let i = 0; i < 1000000; i++) {
    result += Math.random()
  }
  return data.reduce((sum, item) => sum + item.value, 0) + result
})

// Memoized chart component
const Chart = memo(({ data, type }) => {
  const chartData = useMemo(() => {
    console.log('Processing chart data...')
    return data.map(item => ({
      ...item,
      percentage: (item.value / Math.max(...data.map(d => d.value))) * 100
    }))
  }, [data])

  return (
    <div style={{ 
      border: '1px solid var(--border-color)', 
      borderRadius: '8px', 
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <h3>{type} Chart</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {chartData.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ minWidth: '80px' }}>{item.name}</span>
            <div style={{ 
              flex: 1, 
              height: '20px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  height: '100%', 
                  backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                  width: `${item.percentage}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <span style={{ minWidth: '60px', textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

// Memoized data table component
const DataTable = memo(({ data, onSort, sortField, sortDirection }) => {
  const sortedData = useMemo(() => {
    if (!sortField) return data
    
    return [...data].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const multiplier = sortDirection === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * multiplier
      }
      return (aVal - bVal) * multiplier
    })
  }, [data, sortField, sortDirection])

  return (
    <div style={{ 
      border: '1px solid var(--border-color)', 
      borderRadius: '8px', 
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f5f5f5' }}>
          <tr>
            {['name', 'value', 'category'].map(field => (
              <th 
                key={field}
                onClick={() => onSort(field)}
                style={{ 
                  padding: '1rem', 
                  textAlign: 'left', 
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={item.id} style={{ 
              backgroundColor: index % 2 === 0 ? 'white' : '#fafafa' 
            }}>
              <td style={{ padding: '1rem' }}>{item.name}</td>
              <td style={{ padding: '1rem' }}>{item.value}</td>
              <td style={{ padding: '1rem' }}>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Sample data - in real app this would come from API
  const rawData = useMemo(() => [
    { id: 1, name: 'Product A', value: 150, category: 'Electronics' },
    { id: 2, name: 'Product B', value: 230, category: 'Clothing' },
    { id: 3, name: 'Product C', value: 180, category: 'Electronics' },
    { id: 4, name: 'Product D', value: 95, category: 'Books' },
    { id: 5, name: 'Product E', value: 310, category: 'Electronics' },
    { id: 6, name: 'Product F', value: 120, category: 'Clothing' },
    { id: 7, name: 'Product G', value: 275, category: 'Books' },
    { id: 8, name: 'Product H', value: 190, category: 'Electronics' },
  ], [])

  // Filtered and processed data (memoized)
  const processedData = useMemo(() => {
    let filtered = rawData

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (debouncedSearchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }

    return filtered
  }, [rawData, selectedCategory, debouncedSearchTerm])

  // Expensive calculation result (memoized)
  const calculationResult = useMemo(() => {
    return expensiveCalculation(processedData)
  }, [processedData])

  // Memoized event handlers
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className="fade-in">
      <h1>Performance Dashboard</h1>
      <p>This dashboard demonstrates various performance optimizations including memoization, debouncing, and efficient re-rendering.</p>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label htmlFor="search">Search: </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)',
              minWidth: '200px'
            }}
          />
        </div>
        
        <div>
          <label htmlFor="category">Category: </label>
          <select 
            id="category"
            value={selectedCategory} 
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
          </select>
        </div>
        
        <div style={{ marginLeft: 'auto' }}>
          <strong>Calculation Result: {calculationResult.toFixed(2)}</strong>
        </div>
      </div>

      {/* Charts */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <Chart data={processedData} type="Sales" />
        <Chart data={processedData} type="Performance" />
      </div>

      {/* Data Table */}
      <DataTable 
        data={processedData}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Performance Info */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h3>Performance Optimizations Applied:</h3>
        <ul>
          <li><strong>Memoization:</strong> Expensive calculations and data processing are cached</li>
          <li><strong>Debouncing:</strong> Search input is debounced to reduce filtering operations</li>
          <li><strong>React.memo:</strong> Components only re-render when props change</li>
          <li><strong>useMemo:</strong> Expensive computations are cached until dependencies change</li>
          <li><strong>useCallback:</strong> Event handlers are memoized to prevent unnecessary re-renders</li>
        </ul>
      </div>
    </div>
  )
}

Chart.displayName = 'Chart'
DataTable.displayName = 'DataTable'

export default Dashboard