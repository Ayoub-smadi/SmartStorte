import { useState, useEffect, createContext, useContext } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

export const AppContext = createContext(null);

export function useApp() { return useContext(AppContext); }

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json()).then(u => setUser(u)).catch(() => {});
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  const toast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const renderPage = () => {
    if (route === '#/' || route === '' || route === '#') return <HomePage />;
    if (route === '#/products') return <ProductsPage />;
    if (route.startsWith('#/products/')) {
      const id = route.replace('#/products/', '');
      return <ProductDetailPage id={id} />;
    }
    if (route.startsWith('#/category/')) {
      const id = route.replace('#/category/', '');
      return <ProductsPage categoryId={id} />;
    }
    if (route === '#/admin') return user?.isAdmin ? <AdminPage /> : <LoginPage />;
    if (route === '#/login') return <LoginPage />;
    return <HomePage />;
  };

  return (
    <AppContext.Provider value={{ user, setUser, navigate, toast }}>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        {renderPage()}
      </main>
      <Footer />
      <Toast toasts={toasts} />
    </AppContext.Provider>
  );
}
