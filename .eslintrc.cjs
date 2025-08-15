module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Performance-focused rules
    'no-console': 'warn', // Remove console.log in production
    'no-debugger': 'error', // Remove debugger statements
    'no-alert': 'warn', // Avoid alert for better UX
    'no-eval': 'error', // Security and performance
    'no-implied-eval': 'error', // Security and performance
    'no-new-func': 'error', // Security and performance
    'no-script-url': 'error', // Security and performance
    
    // React performance rules
    'react-hooks/exhaustive-deps': 'warn', // Prevent stale closures
    'react/jsx-no-bind': 'warn', // Avoid inline functions in render
    
    // TypeScript performance rules
    '@typescript-eslint/no-unused-vars': 'error', // Remove dead code
    '@typescript-eslint/no-explicit-any': 'warn', // Type safety
    '@typescript-eslint/prefer-const': 'error', // Better performance
    '@typescript-eslint/no-var-requires': 'error', // Use ES modules
  },
}