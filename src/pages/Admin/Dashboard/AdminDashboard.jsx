import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Données simulées (à remplacer par API)
  const [stats, setStats] = useState({
    totalFormulaires: 145,
    formulairesEnAttente: 23,
    rdvProgrammes: 18,
    rdvAujourdhui: 5,
  });

  const [recentForms, setRecentForms] = useState([
    {
      id: 1,
      nom: 'Sophie Dubois',
      profil: 'Particulier',
      region: 'Bruxelles',
      besoin: 'Panneaux solaires',
      date: '2026-08-10',
      statut: 'En attente',
    },
    {
      id: 2,
      nom: 'TechSolutions SA',
      profil: 'Société',
      region: 'Wallonie',
      besoin: 'Pompe à chaleur',
      date: '2026-08-10',
      statut: 'En cours',
    },
    {
      id: 3,
      nom: 'Jean Martin',
      profil: 'Particulier',
      region: 'Flandre',
      besoin: 'Batterie',
      date: '2026-08-09',
      statut: 'Complété',
    },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      client: 'Sophie Dubois',
      date: '2026-08-12',
      heure: '10:00',
      type: 'Visite technique',
      statut: 'Confirmé',
    },
    {
      id: 2,
      client: 'Marc Dupont',
      date: '2026-08-12',
      heure: '14:00',
      type: 'Appel téléphonique',
      statut: 'Confirmé',
    },
    {
      id: 3,
      client: 'TechSolutions SA',
      date: '2026-08-13',
      heure: '09:00',
      type: 'Visite technique',
      statut: 'En attente',
    },
  ]);

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const exportData = () => {
    // Simuler l'export Excel
    alert('Export des données en cours... (Fonctionnalité à implémenter avec le backend)');
  };

  const getStatutClass = (statut) => {
    switch (statut) {
      case 'Complété':
      case 'Confirmé':
        return 'statut-success';
      case 'En cours':
      case 'En attente':
        return 'statut-warning';
      default:
        return 'statut-default';
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🔐 Admin</h2>
          <p>EnergiePlus</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Vue d'ensemble
          </button>
          <button
            className={`nav-item ${activeTab === 'forms' ? 'active' : ''}`}
            onClick={() => setActiveTab('forms')}
          >
            <span className="nav-icon">📝</span>
            Formulaires
          </button>
          <button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="nav-icon">📅</span>
            Rendez-vous
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">📦</span>
            Produits
          </button>
          <button
            className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <span className="nav-icon">📈</span>
            Statistiques
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-link" onClick={() => navigate('/')}>
            ← Retour au site
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>
            {activeTab === 'overview' && 'Vue d\'ensemble'}
            {activeTab === 'forms' && 'Gestion des formulaires'}
            {activeTab === 'appointments' && 'Gestion des rendez-vous'}
            {activeTab === 'products' && 'Gestion du catalogue'}
            {activeTab === 'stats' && 'Statistiques détaillées'}
          </h1>
          <button className="btn btn-primary" onClick={exportData}>
            📥 Exporter les données
          </button>
        </header>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>{stats.totalFormulaires}</h3>
                  <p>Formulaires total</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{stats.formulairesEnAttente}</h3>
                  <p>En attente</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>{stats.rdvProgrammes}</h3>
                  <p>RDV programmés</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">🕐</div>
                <div className="stat-content">
                  <h3>{stats.rdvAujourdhui}</h3>
                  <p>RDV aujourd'hui</p>
                </div>
              </div>
            </div>

            <div className="recent-section">
              <div className="section-card card">
                <h2>Derniers formulaires</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Profil</th>
                        <th>Région</th>
                        <th>Besoin</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentForms.slice(0, 5).map((form) => (
                        <tr key={form.id}>
                          <td>{form.nom}</td>
                          <td>{form.profil}</td>
                          <td>{form.region}</td>
                          <td>{form.besoin}</td>
                          <td>{form.date}</td>
                          <td>
                            <span className={`statut-badge ${getStatutClass(form.statut)}`}>
                              {form.statut}
                            </span>
                          </td>
                          <td>
                            <button className="btn-small btn-primary">Voir</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="section-card card">
                <h2>Prochains rendez-vous</h2>
                <div className="appointments-list">
                  {appointments.slice(0, 3).map((appt) => (
                    <div key={appt.id} className="appointment-item">
                      <div className="appointment-date">
                        <div className="date-day">{appt.date.split('-')[2]}</div>
                        <div className="date-month">AOÛ</div>
                      </div>
                      <div className="appointment-info">
                        <h4>{appt.client}</h4>
                        <p>{appt.type} - {appt.heure}</p>
                      </div>
                      <span className={`statut-badge ${getStatutClass(appt.statut)}`}>
                        {appt.statut}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des formulaires */}
        {activeTab === 'forms' && (
          <div className="forms-management">
            <div className="filters-bar card">
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="search-input"
              />
              <select className="filter-select">
                <option value="">Tous les statuts</option>
                <option value="en-attente">En attente</option>
                <option value="en-cours">En cours</option>
                <option value="complete">Complété</option>
              </select>
              <select className="filter-select">
                <option value="">Toutes les régions</option>
                <option value="wallonie">Wallonie</option>
                <option value="bruxelles">Bruxelles</option>
                <option value="flandre">Flandre</option>
              </select>
            </div>

            <div className="table-card card">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Profil</th>
                    <th>Région</th>
                    <th>Besoin</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentForms.map((form) => (
                    <tr key={form.id}>
                      <td>#{form.id}</td>
                      <td><strong>{form.nom}</strong></td>
                      <td>{form.profil}</td>
                      <td>{form.region}</td>
                      <td>{form.besoin}</td>
                      <td>email@example.com</td>
                      <td>{form.date}</td>
                      <td>
                        <span className={`statut-badge ${getStatutClass(form.statut)}`}>
                          {form.statut}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Voir">👁️</button>
                          <button className="btn-icon" title="Modifier">✏️</button>
                          <button className="btn-icon" title="Supprimer">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gestion des rendez-vous */}
        {activeTab === 'appointments' && (
          <div className="appointments-management">
            <div className="calendar-view card">
              <h2>📅 Calendrier des rendez-vous</h2>
              <div className="appointments-grid">
                {appointments.map((appt) => (
                  <div key={appt.id} className="appointment-card card">
                    <div className="appointment-header">
                      <h4>{appt.client}</h4>
                      <span className={`statut-badge ${getStatutClass(appt.statut)}`}>
                        {appt.statut}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <p>📅 {appt.date}</p>
                      <p>🕐 {appt.heure}</p>
                      <p>📍 {appt.type}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn-small btn-secondary">Annuler</button>
                      <button className="btn-small btn-primary">Confirmer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gestion des produits */}
        {activeTab === 'products' && (
          <div className="products-management">
            <button className="btn btn-primary" style={{ marginBottom: '24px' }}>
              + Ajouter un produit
            </button>
            <div className="info-message card">
              <p>📦 Gestion du catalogue - À implémenter avec le backend</p>
              <p>Fonctionnalités : Ajouter, Modifier, Supprimer des produits</p>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {activeTab === 'stats' && (
          <div className="stats-management">
            <div className="charts-grid">
              <div className="chart-card card">
                <h3>📊 Formulaires par région</h3>
                <div className="chart-placeholder">
                  <div className="bar" style={{ height: '80%' }}>
                    <span>Bruxelles</span>
                    <span>45</span>
                  </div>
                  <div className="bar" style={{ height: '60%' }}>
                    <span>Wallonie</span>
                    <span>35</span>
                  </div>
                  <div className="bar" style={{ height: '40%' }}>
                    <span>Flandre</span>
                    <span>20</span>
                  </div>
                </div>
              </div>

              <div className="chart-card card">
                <h3>📈 Évolution des demandes</h3>
                <p className="info-text">Graphique à implémenter avec Chart.js ou Recharts</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
