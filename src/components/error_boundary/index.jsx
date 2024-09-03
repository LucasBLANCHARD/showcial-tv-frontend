import React from 'react';
import ErrorPage from '../../screens/error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Met à jour l'état pour afficher le fallback UI lors de l'erreur

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi enregistrer l'erreur à un service de monitoring ici
    console.error('Erreur capturée dans ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre tout type de fallback UI ici
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
