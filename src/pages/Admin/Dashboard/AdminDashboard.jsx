import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStatistiques,
  getAdminFormulaires,
  getAdminRendezVous,
  updateAdminRendezVous,
  getProducts,
  createAdminProduit,
  deleteAdminProduit,
  exportAdminFormulairesCsv,
  exportAdminRendezVousCsv,
  exportAdminProduitsCsv,
  exportAdminStatsCsv,
} from '../../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats du backend
  const [stats, setStats] = useState({
    formulairesRecus: 0,
    totalVisiteurs: 0,
    tauxConversion: 0,
    particuliers: 0,
    societes: 0,
    repartitionParRegion: { Wallonie: 0, Bruxelles: 0, Flandre: 0 },
  });

  // Liste des formulaires (Visiteurs / CRM)
  const [formsList, setFormsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('');
  const [selectedProfilFilter, setSelectedProfilFilter] = useState('');
  const [selectedFormDetail, setSelectedFormDetail] = useState(null);

  // Liste des Rendez-vous
  const [appointments, setAppointments] = useState([]);

  // Liste des Produits
  const [productsList, setProductsList] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nom: '',
    type: 'panneaux',
    prix: '',
    specifications: '',
  });

  // Message de statut/feedback
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // Chargement des données au montage
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Statistiques
      const statsData = await getAdminStatistiques().catch(() => null);
      if (statsData) {
        setStats({
          formulairesRecus: statsData.formulairesRecus || 0,
          totalVisiteurs: statsData.totalVisiteurs || 0,
          tauxConversion: statsData.tauxConversion || 0,
          particuliers: statsData.particuliers || 0,
          societes: statsData.societes || 0,
          repartitionParRegion: statsData.repartitionParRegion || { Wallonie: 0, Bruxelles: 0, Flandre: 0 },
        });
      }

      // 2. Formulaires CRM
      const formsData = await getAdminFormulaires().catch(() => []);
      setFormsList(formsData || []);

      // 3. Rendez-vous
      const rdvData = await getAdminRendezVous().catch(() => []);
      setAppointments(rdvData || []);

      // 4. Produits
      const prodsData = await getProducts('all').catch(() => []);
      setProductsList(prodsData || []);
    } catch (err) {
      console.error('Erreur chargement données dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  // Export CSV spécifique à chaque onglet
  const handleExportCsv = async () => {
    try {
      if (activeTab === 'appointments') {
        setFeedback('Export du planning des rendez-vous en cours...');
        exportAdminRendezVousCsv(appointments);
      } else if (activeTab === 'products') {
        setFeedback('Export du catalogue de produits en cours...');
        exportAdminProduitsCsv(productsList);
      } else if (activeTab === 'stats') {
        setFeedback('Export des statistiques globales en cours...');
        exportAdminStatsCsv(stats);
      } else {
        setFeedback('Export des formulaires CRM en cours...');
        await exportAdminFormulairesCsv(formsList);
      }
      setFeedback('Fichier CSV généré et téléchargé avec succès !');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      alert('Erreur lors de l\'export CSV: ' + err.message);
      setFeedback('');
    }
  };

  // Modification statut RDV
  const handleUpdateRdvStatus = async (id, newStatut) => {
    try {
      await updateAdminRendezVous(id, newStatut);
      setFeedback(`Rendez-vous #${id} mis à jour : ${newStatut}`);
      setTimeout(() => setFeedback(''), 3000);
      loadDashboardData();
    } catch (err) {
      alert('Erreur mise à jour RDV: ' + err.message);
    }
  };

  // Création Produit
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.nom || !newProduct.prix) return;
    try {
      await createAdminProduit({
        nom: newProduct.nom,
        type: newProduct.type,
        prix: parseFloat(newProduct.prix),
        specifications: newProduct.specifications,
      });
      setFeedback(`Produit "${newProduct.nom}" créé avec succès dans Spring Boot !`);
      setShowAddProductModal(false);
      setNewProduct({ nom: '', type: 'panneaux', prix: '', specifications: '' });
      setTimeout(() => setFeedback(''), 4000);
      loadDashboardData();
    } catch (err) {
      alert('Erreur création produit: ' + err.message);
    }
  };

  // Suppression Produit
  const handleDeleteProduct = async (id, nom) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le produit "${nom}" ?`)) return;
    try {
      await deleteAdminProduit(id);
      setFeedback(`Produit "${nom}" supprimé.`);
      setTimeout(() => setFeedback(''), 3000);
      loadDashboardData();
    } catch (err) {
      alert('Erreur suppression produit: ' + err.message);
    }
  };

  // Filtrage des formulaires
  const filteredForms = formsList.filter((f) => {
    const matchSearch =
      !searchQuery ||
      String(f.id).includes(searchQuery) ||
      (f.visiteurId && String(f.visiteurId).includes(searchQuery)) ||
      (f.profil && f.profil.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const formRegion = f.regions && f.regions.length > 0 ? f.regions[0].nom : '';
    const matchRegion = !selectedRegionFilter || formRegion.toLowerCase() === selectedRegionFilter.toLowerCase();
    const matchProfil = !selectedProfilFilter || (f.profil && f.profil.toLowerCase() === selectedProfilFilter.toLowerCase());
    
    return matchSearch && matchRegion && matchProfil;
  });

  const getStatutClass = (statut) => {
    if (!statut) return 'statut-default';
    const s = statut.toUpperCase();
    if (s.includes('CONFIRME') || s.includes('COMPLETE')) return 'statut-success';
    if (s.includes('ATTENTE') || s.includes('COURS')) return 'statut-warning';
    return 'statut-default';
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🔐 Admin</h2>
          <p>EnergiePlus Platform</p>
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
            Formulaires CRM ({formsList.length})
          </button>
          <button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <span className="nav-icon">📅</span>
            Rendez-vous ({appointments.length})
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">📦</span>
            Produits ({productsList.length})
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
          <div>
            <h1>
              {activeTab === 'overview' && 'Vue d\'ensemble'}
              {activeTab === 'forms' && 'Gestion des formulaires & Visiteurs'}
              {activeTab === 'appointments' && 'Gestion du planning des rendez-vous'}
              {activeTab === 'products' && 'Gestion du catalogue de produits'}
              {activeTab === 'stats' && 'Statistiques détaillées'}
            </h1>
            {feedback && <div style={{ color: 'var(--secondary-color)', fontWeight: 'bold', marginTop: '8px' }}>✅ {feedback}</div>}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={loadDashboardData} disabled={loading}>
              🔄 Actualiser
            </button>
            <button className="btn btn-primary" onClick={handleExportCsv}>
              📥 {activeTab === 'overview' && "Exporter la Vue d'ensemble (CSV)"}
              {activeTab === 'forms' && 'Exporter les Formulaires CRM (CSV)'}
              {activeTab === 'appointments' && 'Exporter les Rendez-vous (CSV)'}
              {activeTab === 'products' && 'Exporter les Produits (CSV)'}
              {activeTab === 'stats' && 'Exporter les Statistiques (CSV)'}
            </button>
          </div>
        </header>

        {/* 1. VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">📝</div>
                <div className="stat-content">
                  <h3>{stats.formulairesRecus}</h3>
                  <p>Formulaires reçus</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalVisiteurs}</h3>
                  <p>Total Visiteurs</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">🏠</div>
                <div className="stat-content">
                  <h3>{stats.particuliers} / {stats.societes}</h3>
                  <p>Particuliers / Sociétés</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>{appointments.length}</h3>
                  <p>Rendez-vous au total</p>
                </div>
              </div>
            </div>

            <div className="recent-section">
              <div className="section-card card">
                <h2>Derniers formulaires enregistrés</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Visiteur</th>
                        <th>Profil</th>
                        <th>Régions</th>
                        <th>Date Soumission</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formsList.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                            Aucun formulaire enregistré.
                          </td>
                        </tr>
                      ) : (
                        formsList.slice(0, 5).map((f) => (
                          <tr key={f.id}>
                            <td>#{f.id}</td>
                            <td>Visiteur #{f.visiteurId || f.id}</td>
                            <td>{f.profil || 'Particulier'}</td>
                            <td>{f.regions?.map((r) => r.nom).join(', ') || 'N/A'}</td>
                            <td>{f.dateSoumission ? f.dateSoumission.substring(0, 10) : 'Récemment'}</td>
                            <td>
                              <button
                                className="btn-small btn-primary"
                                onClick={() => setSelectedFormDetail(f)}
                              >
                                Détails
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="section-card card">
                <h2>Prochains rendez-vous</h2>
                <div className="appointments-list">
                  {appointments.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun rendez-vous planifié.</p>
                  ) : (
                    appointments.slice(0, 4).map((appt) => (
                      <div key={appt.id} className="appointment-item">
                        <div className="appointment-date">
                          <div className="date-day">{appt.date ? appt.date.split('-')[2] || 'RDV' : 'RDV'}</div>
                          <div className="date-month">JOUR</div>
                        </div>
                        <div className="appointment-info">
                          <h4>Visiteur #{appt.visiteurId || appt.id}</h4>
                          <p>{appt.date} à {appt.heure}</p>
                        </div>
                        <span className={`statut-badge ${getStatutClass(appt.statut)}`}>
                          {appt.statut}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. FORMULAIRES CRM */}
        {activeTab === 'forms' && (
          <div className="forms-management">
            <div className="filters-bar card">
              <input
                type="text"
                placeholder="Rechercher par ID, profil..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="filter-select"
                value={selectedProfilFilter}
                onChange={(e) => setSelectedProfilFilter(e.target.value)}
              >
                <option value="">Tous les profils</option>
                <option value="particulier">Particulier</option>
                <option value="societe">Société</option>
              </select>
              <select
                className="filter-select"
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
              >
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
                    <th>Formulaire ID</th>
                    <th>Visiteur ID</th>
                    <th>Profil</th>
                    <th>Régions</th>
                    <th>Étape atteinte</th>
                    <th>Date de soumission</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForms.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                        Aucun formulaire ne correspond aux critères.
                      </td>
                    </tr>
                  ) : (
                    filteredForms.map((f) => (
                      <tr key={f.id}>
                        <td><strong>#{f.id}</strong></td>
                        <td>Visiteur #{f.visiteurId}</td>
                        <td>{f.profil || 'Particulier'}</td>
                        <td>{f.regions?.map((r) => r.nom).join(', ') || 'Global'}</td>
                        <td>Étape {f.etapeActuelle || 5}/5</td>
                        <td>{f.dateSoumission ? f.dateSoumission.substring(0, 10) : 'Récemment'}</td>
                        <td>
                          <button
                            className="btn-small btn-primary"
                            onClick={() => setSelectedFormDetail(f)}
                          >
                            👁️ Consulter
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. RENDEZ-VOUS */}
        {activeTab === 'appointments' && (
          <div className="appointments-management">
            <div className="calendar-view card">
              <h2>📅 Planning des rendez-vous ({appointments.length})</h2>
              <div className="appointments-grid">
                {appointments.length === 0 ? (
                  <p className="info-text">Aucun rendez-vous à afficher.</p>
                ) : (
                  appointments.map((appt) => (
                    <div key={appt.id} className="appointment-card card">
                      <div className="appointment-header">
                        <h4>Rendez-vous #{appt.id}</h4>
                        <span className={`statut-badge ${getStatutClass(appt.statut)}`}>
                          {appt.statut}
                        </span>
                      </div>
                      <div className="appointment-details">
                        <p>👤 Visiteur #{appt.visiteurId}</p>
                        <p>📅 Date: <strong>{appt.date}</strong></p>
                        <p>🕐 Heure: <strong>{appt.heure}</strong></p>
                      </div>
                      <div className="appointment-actions">
                        <button
                          className="btn-small btn-secondary"
                          onClick={() => handleUpdateRdvStatus(appt.id, 'ANNULE')}
                        >
                          Annuler
                        </button>
                        <button
                          className="btn-small btn-primary"
                          onClick={() => handleUpdateRdvStatus(appt.id, 'CONFIRME')}
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. PRODUITS (CATALOGUE CRUD) */}
        {activeTab === 'products' && (
          <div className="products-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Catalogue de produits ({productsList.length})</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddProductModal(true)}
              >
                + Ajouter un produit
              </button>
            </div>

            <div className="table-card card">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom du produit</th>
                    <th>Type</th>
                    <th>Prix (€)</th>
                    <th>Spécifications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                        Aucun produit dans le catalogue.
                      </td>
                    </tr>
                  ) : (
                    productsList.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td><strong>{p.name || p.nom}</strong></td>
                        <td><span className="statut-badge statut-default">{p.type}</span></td>
                        <td><strong>{(p.price || p.prix || 0).toLocaleString('fr-BE')} €</strong></td>
                        <td>
                          {p.specifications
                            ? typeof p.specifications === 'string'
                              ? p.specifications
                              : JSON.stringify(p.specifications)
                            : 'N/A'}
                        </td>
                        <td>
                          <button
                            className="btn-small btn-secondary"
                            onClick={() => handleDeleteProduct(p.id, p.name || p.nom)}
                          >
                            🗑️ Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. STATISTIQUES */}
        {activeTab === 'stats' && (
          <div className="stats-management">
            <div className="charts-grid">
              <div className="chart-card card">
                <h3>📊 Formulaires par région (Backend)</h3>
                <div className="chart-placeholder">
                  <div className="bar" style={{ height: '80%' }}>
                    <span>Wallonie</span>
                    <span>{stats.repartitionParRegion?.Wallonie || 0}</span>
                  </div>
                  <div className="bar" style={{ height: '65%' }}>
                    <span>Bruxelles</span>
                    <span>{stats.repartitionParRegion?.Bruxelles || 0}</span>
                  </div>
                  <div className="bar" style={{ height: '45%' }}>
                    <span>Flandre</span>
                    <span>{stats.repartitionParRegion?.Flandre || 0}</span>
                  </div>
                </div>
              </div>

              <div className="chart-card card">
                <h3>📈 Taux de conversion & Profils</h3>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Taux de conversion global</p>
                    <h2 style={{ margin: '4px 0', color: 'var(--primary-color)' }}>
                      {(stats.tauxConversion * 100).toFixed(1)}%
                    </h2>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Visiteurs Particuliers</p>
                    <h3 style={{ margin: '4px 0' }}>{stats.particuliers}</h3>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Visiteurs Sociétés</p>
                    <h3 style={{ margin: '4px 0' }}>{stats.societes}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL AJOUT PRODUIT */}
        {showAddProductModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div className="card" style={{ width: '500px', padding: '32px' }}>
              <h2>Ajouter un nouveau produit</h2>
              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label>Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.nom}
                    onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                    placeholder="Ex: Panneau Photovoltaïque 500W"
                  />
                </div>
                <div className="form-group">
                  <label>Type de produit *</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                  >
                    <option value="panneaux">Panneaux solaires</option>
                    <option value="batterie">Batterie</option>
                    <option value="pompe">Pompe à chaleur</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.prix}
                    onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })}
                    placeholder="Ex: 6500"
                  />
                </div>
                <div className="form-group">
                  <label>Spécifications techniques</label>
                  <textarea
                    rows="3"
                    value={newProduct.specifications}
                    onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                    placeholder="Ex: Puissance 6 kWc, Garantie 25 ans..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer dans Spring Boot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DETAIL FORMULAIRE */}
        {selectedFormDetail && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div className="card" style={{ width: '600px', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
              <h2>Détails du Formulaire #{selectedFormDetail.id}</h2>
              <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p><strong>Visiteur ID :</strong> #{selectedFormDetail.visiteurId}</p>
                <p><strong>Profil :</strong> {selectedFormDetail.profil || 'Particulier'}</p>
                <p><strong>Date de soumission :</strong> {selectedFormDetail.dateSoumission || 'Récemment'}</p>
                <p><strong>Régions :</strong> {selectedFormDetail.regions?.map((r) => r.nom).join(', ') || 'N/A'}</p>
                <div>
                  <strong>Réponses saisies :</strong>
                  {selectedFormDetail.reponses && Object.keys(selectedFormDetail.reponses).length > 0 ? (
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {Object.entries(selectedFormDetail.reponses).map(([key, val]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {val}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Aucune réponse enregistrée.</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="btn btn-primary" onClick={() => setSelectedFormDetail(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
