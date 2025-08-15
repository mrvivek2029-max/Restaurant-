#!/usr/bin/env node

/**
 * Performance Analysis Script
 * This script helps analyze the performance of the application
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Performance Analysis Tool');
console.log('============================\n');

// Check bundle size
function analyzeBundleSize() {
  console.log('📦 Bundle Size Analysis:');
  
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    let totalSize = 0;
    
    files.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        const filePath = path.join(distPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        console.log(`  ${file}: ${sizeKB} KB`);
      }
    });
    
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`\n  Total: ${totalSizeKB} KB (${totalSizeMB} MB)`);
    
    // Performance recommendations
    if (totalSize > 500 * 1024) { // > 500KB
      console.log('  ⚠️  Bundle size is large. Consider:');
      console.log('     - Code splitting');
      console.log('     - Tree shaking');
      console.log('     - Lazy loading');
    } else {
      console.log('  ✅ Bundle size is optimized');
    }
  } else {
    console.log('  ❌ Dist folder not found. Run "npm run build" first.');
  }
}

// Check for performance anti-patterns
function analyzeCodePatterns() {
  console.log('\n🔍 Code Pattern Analysis:');
  
  const srcPath = path.join(__dirname, 'src');
  if (fs.existsSync(srcPath)) {
    const files = walkDir(srcPath);
    let issues = 0;
    
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for common performance issues
        if (content.includes('console.log') && !file.includes('.test.')) {
          console.log(`  ⚠️  ${file}: Contains console.log (remove in production)`);
          issues++;
        }
        
        if (content.includes('setInterval') || content.includes('setTimeout')) {
          console.log(`  ⚠️  ${file}: Contains timers (ensure cleanup)`);
          issues++;
        }
        
        if (content.includes('document.querySelector') || content.includes('document.getElementById')) {
          console.log(`  ⚠️  ${file}: Direct DOM manipulation (use React refs)`);
          issues++;
        }
      }
    });
    
    if (issues === 0) {
      console.log('  ✅ No obvious performance issues found');
    }
  }
}

// Check dependencies
function analyzeDependencies() {
  console.log('\n📚 Dependency Analysis:');
  
  const packagePath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const largeDeps = [];
    Object.entries(deps).forEach(([name, version]) => {
      // This is a simplified check - in reality you'd need to analyze node_modules
      if (name.includes('lodash') || name.includes('moment') || name.includes('jquery')) {
        largeDeps.push(name);
      }
    });
    
    if (largeDeps.length > 0) {
      console.log('  ⚠️  Large dependencies detected:');
      largeDeps.forEach(dep => console.log(`     - ${dep}`));
    } else {
      console.log('  ✅ Dependencies look optimized');
    }
  }
}

// Utility function to walk directory
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
}

// Performance recommendations
function showRecommendations() {
  console.log('\n💡 Performance Recommendations:');
  console.log('  1. Use React.memo() for expensive components');
  console.log('  2. Implement virtual scrolling for large lists');
  console.log('  3. Use React.lazy() for code splitting');
  console.log('  4. Optimize images with WebP format');
  console.log('  5. Implement service worker for caching');
  console.log('  6. Use CSS containment for better rendering');
  console.log('  7. Minimize JavaScript bundle size');
  console.log('  8. Implement proper error boundaries');
}

// Run analysis
function runAnalysis() {
  analyzeBundleSize();
  analyzeCodePatterns();
  analyzeDependencies();
  showRecommendations();
  
  console.log('\n✨ Analysis complete!');
  console.log('Run "npm run analyze" for detailed bundle analysis');
  console.log('Run "npm run lighthouse" for web performance metrics');
}

runAnalysis();