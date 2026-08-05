import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 40, fontFamily: 'monospace', background: '#fff3f3',
          minHeight: '100vh', direction: 'ltr'
        }}>
          <h2 style={{ color: '#c00' }}>⚠️ React Error</h2>
          <pre style={{
            background: '#fff', border: '1px solid #fcc', padding: 20,
            borderRadius: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            fontSize: 13, color: '#333'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
