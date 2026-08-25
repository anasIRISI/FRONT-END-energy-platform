import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Connexion directe avec le Backend Spring Boot sur /api/admin/auth/login
      const res = await adminLogin(credentials.username, credentials.password);
      if (res && res.token) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify({ username: credentials.username, role: 'ADMIN' }));
        navigate('/admin/dashboard');
        return;
      } else {
        setError('Impossible d\'obtenir un jeton d\'authentification JWT.');
      }
    } catch (err) {
      console.error('Erreur authentification admin:', err);
      setError('Identifiants incorrects ou backend non disponible. Utilisez (admin / admin123) après avoir démarré le backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container card">
        <div className="login-header">
          <div className="admin-icon">🔐</div>
          <h1>Administration</h1>
          <p>Espace réservé aux administrateurs</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Ex: admin"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Ex: admin123"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Identifiants Backend Spring Boot :</strong> admin / admin123
          </p>
          <button className="btn-link" onClick={() => navigate('/')}>
            ← Retour au site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
