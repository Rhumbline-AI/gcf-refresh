'use client'

import React from 'react'

type State = { error: Error | null }

export class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Payload admin error:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '2rem auto',
            fontFamily: 'system-ui, sans-serif',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
          }}
        >
          <h1 style={{ color: '#b91c1c', marginTop: 0 }}>Admin failed to load</h1>
          <p style={{ color: '#991b1b', marginBottom: '1rem' }}>
            Open the browser console (F12 → Console) for full details.
          </p>
          <pre
            style={{
              background: '#fff',
              padding: '1rem',
              overflow: 'auto',
              fontSize: '13px',
              border: '1px solid #fecaca',
              borderRadius: '4px',
            }}
          >
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#b91c1c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
