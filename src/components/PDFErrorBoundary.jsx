import React from 'react';

export class PDFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red' }}>⚠️ Error generating PDF. Please try again.</div>;
    }

    return this.props.children;
  }
}
