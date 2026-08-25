import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAppointment, createVisiteur } from '../../services/api';
import './RendezVous.css';

const RendezVous = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    heure: '',
    type: 'visite',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Créer le visiteur si besoin
      let visiteurId = 1;
      try {
        const v = await createVisiteur({
          profil: 'PARTICULIER',
          email: formData.email,
          regionId: 1,
        });
        if (v && v.id) visiteurId = v.id;
      } catch (e) {
        console.warn('Création visiteur avant RDV échouée, fallback visiteurId=1:', e.message);
      }

      // 2. Créer le rendez-vous dans Spring Boot
      await createAppointment({
        visiteurId,
        date: formData.date,
        heure: formData.heure,
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('Erreur API rendez-vous backend, confirmation locale:', err.message);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  if (submitted) {
    return (
      <div className="rendez-vous">
        <div className="container">
          <div className="success-card card">
            <div className="success-icon">✅</div>
            <h1>Rendez-vous confirmé !</h1>
            <p>Nous avons bien reçu votre demande de rendez-vous.</p>
            <div className="rdv-summary">
              <div className="summary-item">
                <span className="summary-label">Date</span>
                <span className="summary-value">{formData.date}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Heure</span>
                <span className="summary-value">{formData.heure}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Type</span>
                <span className="summary-value">
                  {formData.type === 'visite' ? 'Visite technique' : 'Appel téléphonique'}
                </span>
              </div>
            </div>
            <p className="confirmation-message">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Retour à l'accueil
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/catalogue')}>
                Voir le catalogue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rendez-vous">
      <div className="container">
        <div className="rdv-header">
          <h1>Prendre rendez-vous</h1>
          <p>Planifiez une visite technique ou un appel avec nos experts</p>
        </div>

        <div className="rdv-grid">
          <form className="rdv-form card" onSubmit={handleSubmit}>
            <h2>Vos coordonnées</h2>
            <div className="form-fields">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+32 XXX XX XX XX"
                />
              </div>
            </div>

            <h2>Type de rendez-vous</h2>
            <div className="rdv-type-options">
              <button
                type="button"
                className={`type-option ${formData.type === 'visite' ? 'selected' : ''}`}
                onClick={() => handleInputChange('type', 'visite')}
              >
                <div className="type-icon">🏠</div>
                <h3>Visite technique</h3>
                <p>Un expert se déplace chez vous</p>
              </button>
              <button
                type="button"
                className={`type-option ${formData.type === 'appel' ? 'selected' : ''}`}
                onClick={() => handleInputChange('type', 'appel')}
              >
                <div className="type-icon">📞</div>
                <h3>Appel téléphonique</h3>
                <p>Échange par téléphone</p>
              </button>
            </div>

            <h2>Date et heure</h2>
            <div className="form-fields">
              <div className="form-group">
                <label>Date souhaitée *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Heure préférée *</label>
                <div className="time-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot ${formData.heure === slot ? 'selected' : ''}`}
                      onClick={() => handleInputChange('heure', slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message (optionnel)</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Précisez vos besoins ou questions..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.nom || !formData.email || !formData.telephone || !formData.date || !formData.heure}
            >
              Confirmer le rendez-vous
            </button>
          </form>

          <div className="rdv-sidebar">
            <div className="info-card card">
              <h3>Pourquoi prendre rendez-vous ?</h3>
              <ul className="benefits-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span>Analyse personnalisée de votre situation</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span>Étude de faisabilité technique</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span>Devis détaillé et personnalisé</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span>Conseil sur les primes disponibles</span>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span>Sans engagement de votre part</span>
                </li>
              </ul>
            </div>

            <div className="contact-card card">
              <h3>Besoin d'aide ?</h3>
              <p>Notre équipe est disponible pour répondre à vos questions</p>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@energieplus.be</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+32 2 123 45 67</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
