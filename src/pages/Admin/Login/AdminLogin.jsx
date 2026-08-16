import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Authentification simple (à remplacer par API backend)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('admin_token', 'demo_token');
      localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', role: 'admin' }));
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants incorrects');
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
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Démo :</strong> admin / admin123
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
