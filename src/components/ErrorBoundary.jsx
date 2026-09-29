import React from 'react';
import { AlertTriangle, RefreshCw, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.handleReset
        });
      }

      const componentName = this.props.name || 'Component';

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          height: '100%',
          padding: '32px 24px',
          background: 'var(--bg, #07080c)',
          color: 'var(--text, #ffffff)',
          fontFamily: 'var(--font, sans-serif)',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            background: 'var(--bg2, #12141c)',
            border: '1px solid var(--border, #222634)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#ef4444'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text, #ffffff)',
              margin: '0 0 8px'
            }}>
              {componentName} Encountered an Issue
            </h2>

            <p style={{
              fontSize: '14px',
              color: 'var(--text3, #94a3b8)',
              margin: '0 0 24px',
              lineHeight: 1.5
            }}>
              {this.state.error?.message || 'An unexpected rendering error occurred. You can reload this view or return to the main dashboard.'}
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'var(--accent, #f97316)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
              >
                <RefreshCw size={14} /> Try Again
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'var(--bg3, #1a1d29)',
                  color: 'var(--text2, #cbd5e1)',
                  border: '1px solid var(--border, #222634)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('erp_currentView', 'table');
                  window.location.href = '/dashboard';
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: 'transparent',
                  color: 'var(--text3, #94a3b8)',
                  border: '1px solid var(--border, #222634)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <LayoutDashboard size={14} /> Go to Orders Table
              </button>
            </div>

            <button
              type="button"
              onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: 'var(--text3, #94a3b8)',
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {this.state.showDetails ? 'Hide technical details' : 'Show technical details'}
            </button>

            {this.state.showDetails && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'var(--bg, #07080c)',
                border: '1px solid var(--border, #222634)',
                borderRadius: '6px',
                textAlign: 'left',
                maxHeight: '220px',
                overflowY: 'auto',
                fontSize: '11px',
                fontFamily: 'var(--font-mono, monospace)',
                color: '#ef4444',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                <strong>{this.state.error?.toString()}</strong>
                {this.state.errorInfo?.componentStack}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
