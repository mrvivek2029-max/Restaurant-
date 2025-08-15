#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the built application for performance optimization opportunities
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
}

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeDistFolder() {
  const distPath = path.join(__dirname, 'dist')
  
  if (!fs.existsSync(distPath)) {
    log('❌ No dist folder found. Please run "npm run build" first.', 'red')
    return null
  }

  const analysis = {
    totalSize: 0,
    jsFiles: [],
    cssFiles: [],
    assets: [],
    chunks: {}
  }

  function scanDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const fileRelativePath = path.join(relativePath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isDirectory()) {
        scanDirectory(filePath, fileRelativePath)
      } else {
        const fileInfo = {
          name: file,
          path: fileRelativePath,
          size: stats.size,
          formattedSize: formatBytes(stats.size)
        }
        
        analysis.totalSize += stats.size
        
        if (file.endsWith('.js')) {
          analysis.jsFiles.push(fileInfo)
        } else if (file.endsWith('.css')) {
          analysis.cssFiles.push(fileInfo)
        } else {
          analysis.assets.push(fileInfo)
        }
      }
    })
  }

  scanDirectory(distPath)
  
  // Sort by size (largest first)
  analysis.jsFiles.sort((a, b) => b.size - a.size)
  analysis.cssFiles.sort((a, b) => b.size - a.size)
  analysis.assets.sort((a, b) => b.size - a.size)
  
  return analysis
}

function analyzePackageJson() {
  const packagePath = path.join(__dirname, 'package.json')
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const dependencies = packageData.dependencies || {}
  const devDependencies = packageData.devDependencies || {}
  
  // Known heavy dependencies
  const heavyDependencies = {
    'lodash': 'Consider using lodash-es or individual functions',
    'moment': 'Consider switching to date-fns or dayjs',
    'react-router-dom': 'Consider code splitting routes',
    'axios': 'Consider using fetch API for simple requests'
  }
  
  const suggestions = []
  
  Object.keys(dependencies).forEach(dep => {
    if (heavyDependencies[dep]) {
      suggestions.push({
        dependency: dep,
        suggestion: heavyDependencies[dep]
      })
    }
  })
  
  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
    suggestions
  }
}

function generateReport(analysis, packageAnalysis) {
  log('\n🔍 Bundle Analysis Report', 'cyan')
  log('================================', 'cyan')
  
  // Overall stats
  log(`\n📊 Overall Statistics:`, 'blue')
  log(`Total bundle size: ${formatBytes(analysis.totalSize)}`)
  log(`JavaScript files: ${analysis.jsFiles.length}`)
  log(`CSS files: ${analysis.cssFiles.length}`)
  log(`Other assets: ${analysis.assets.length}`)
  
  // JavaScript analysis
  if (analysis.jsFiles.length > 0) {
    log(`\n📦 JavaScript Files:`, 'blue')
    analysis.jsFiles.forEach(file => {
      const sizeColor = file.size > 500000 ? 'red' : file.size > 100000 ? 'yellow' : 'green'
      log(`  ${file.name}: ${file.formattedSize}`, sizeColor)
    })
  }
  
  // CSS analysis
  if (analysis.cssFiles.length > 0) {
    log(`\n🎨 CSS Files:`, 'blue')
    analysis.cssFiles.forEach(file => {
      const sizeColor = file.size > 100000 ? 'red' : file.size > 50000 ? 'yellow' : 'green'
      log(`  ${file.name}: ${file.formattedSize}`, sizeColor)
    })
  }
  
  // Performance recommendations
  log(`\n⚡ Performance Recommendations:`, 'yellow')
  
  // Bundle size recommendations
  const totalSizeMB = analysis.totalSize / (1024 * 1024)
  if (totalSizeMB > 5) {
    log(`  ❌ Total bundle size (${formatBytes(analysis.totalSize)}) is quite large`, 'red')
    log(`     Consider code splitting and lazy loading`, 'white')
  } else if (totalSizeMB > 2) {
    log(`  ⚠️  Total bundle size (${formatBytes(analysis.totalSize)}) could be optimized`, 'yellow')
  } else {
    log(`  ✅ Total bundle size (${formatBytes(analysis.totalSize)}) is good`, 'green')
  }
  
  // Large file recommendations
  const largeJSFiles = analysis.jsFiles.filter(file => file.size > 500000)
  if (largeJSFiles.length > 0) {
    log(`  ❌ Large JavaScript files detected:`, 'red')
    largeJSFiles.forEach(file => {
      log(`     - ${file.name} (${file.formattedSize})`, 'white')
    })
    log(`     Consider code splitting these files`, 'white')
  }
  
  // Dependency recommendations
  if (packageAnalysis.suggestions.length > 0) {
    log(`\n📚 Dependency Optimization Suggestions:`, 'yellow')
    packageAnalysis.suggestions.forEach(suggestion => {
      log(`  • ${suggestion.dependency}: ${suggestion.suggestion}`, 'white')
    })
  }
  
  // General recommendations
  log(`\n💡 General Optimization Tips:`, 'green')
  log(`  1. Enable gzip/brotli compression on your server`)
  log(`  2. Use tree shaking to eliminate unused code`)
  log(`  3. Consider using dynamic imports for code splitting`)
  log(`  4. Optimize images and use modern formats (WebP, AVIF)`)
  log(`  5. Implement service worker for caching`)
  log(`  6. Use React.lazy() for route-based code splitting`)
  log(`  7. Monitor Core Web Vitals regularly`)
}

function runBundleAnalyzer() {
  try {
    log('\n🔧 Running Vite Bundle Analyzer...', 'blue')
    execSync('npx vite-bundle-analyzer dist', { stdio: 'inherit' })
  } catch (error) {
    log('⚠️  Could not run vite-bundle-analyzer. Make sure it\'s installed.', 'yellow')
    log('   Run: npm install --save-dev vite-bundle-analyzer', 'white')
  }
}

function main() {
  log('🚀 Starting Bundle Analysis...', 'cyan')
  
  // Analyze built files
  const analysis = analyzeDistFolder()
  if (!analysis) return
  
  // Analyze dependencies
  const packageAnalysis = analyzePackageJson()
  
  // Generate report
  generateReport(analysis, packageAnalysis)
  
  // Run interactive bundle analyzer
  log('\n🔍 Would you like to run the interactive bundle analyzer? (y/n)', 'cyan')
  
  // For automation, we'll skip the interactive part
  // In a real scenario, you might want to add readline for user input
  log('💡 To run the interactive analyzer manually, use: npm run analyze', 'blue')
  
  log('\n✅ Analysis complete!', 'green')
}

if (require.main === module) {
  main()
}

module.exports = {
  analyzeDistFolder,
  analyzePackageJson,
  formatBytes
}