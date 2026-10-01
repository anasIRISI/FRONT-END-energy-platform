import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import {
  Home,
  Catalogue,
  ProductDetail,
  Formulaire,
  Simulation,
  RendezVous,
} from './pages';
import { AdminLogin, AdminDashboard } from './pages/Admin';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (sans Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes (avec Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:slug" element={<ProductDetail />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/formulaire/:productSlug" element={<Formulaire />} />
          <Route path="/simulation/:reference" element={<Simulation />} />
          <Route path="/rendez-vous" element={<RendezVous />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
