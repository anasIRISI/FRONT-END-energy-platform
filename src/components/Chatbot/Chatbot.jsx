import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../../services/api';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant énergie. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Voir le catalogue', action: () => navigate('/catalogue') },
    { label: 'Prendre rendez-vous', action: () => navigate('/rendez-vous') },
    { label: 'Comparer les produits', action: () => handleSendMessage('Je veux comparer les produits') },
    { label: 'Aide pour choisir', action: () => handleSendMessage('Aidez-moi à choisir un produit') },
  ];

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Tenter l'envoi au service API Chatbot Backend
      const response = await sendChatMessage(text, conversationId, 1);
      if (response && response.conversationId) {
        setConversationId(response.conversationId);
      }
      const responseText = response?.contenu || generateBotResponse(text);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.warn('Fallback bot local pour chatbot:', err.message);
      const botResponse = generateBotResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('panneau') || message.includes('photovoltaïque')) {
      return "Les panneaux photovoltaïques sont excellents pour réduire vos factures d'énergie. Selon votre région en Belgique, vous pouvez bénéficier de primes intéressantes. Voulez-vous voir notre catalogue de panneaux ?";
    }

    if (message.includes('batterie')) {
      return "Une batterie vous permet de stocker l'énergie produite par vos panneaux. C'est particulièrement utile pour être autonome. Je peux vous aider à calculer la capacité dont vous avez besoin.";
    }

    if (message.includes('pompe') || message.includes('chaleur')) {
      return "Les pompes à chaleur sont une solution efficace pour le chauffage et la climatisation. Elles peuvent vous faire économiser jusqu'à 60% sur vos coûts de chauffage. Voulez-vous en savoir plus ?";
    }

    if (message.includes('comparer') || message.includes('choisir')) {
      return "Je peux vous aider à choisir ! Pour vous recommander le meilleur produit, j'ai besoin de quelques informations : Êtes-vous un particulier ou une société ? Et dans quelle région êtes-vous situé(e) ?";
    }

    if (message.includes('rendez-vous') || message.includes('rdv')) {
      return "Parfait ! Je peux vous aider à planifier un rendez-vous avec l'un de nos techniciens. Quelle date vous conviendrait ?";
    }

    if (message.includes('prix') || message.includes('coût')) {
      return "Les prix varient selon vos besoins et votre région. Je vous propose de remplir notre formulaire rapide pour obtenir une estimation personnalisée et précise. Voulez-vous commencer ?";
    }

    if (message.includes('prime') || message.includes('aide')) {
      return "Les primes varient selon votre région (Wallonie, Bruxelles, Flandre) et votre profil. Après avoir rempli le formulaire, je calculerai automatiquement les primes auxquelles vous avez droit.";
    }

    return "Je comprends votre question. Pour vous donner une réponse précise et personnalisée, je vous invite à consulter notre catalogue ou à remplir le formulaire. Je suis là pour vous guider à chaque étape !";
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" />
            </svg>
          </div>
          <div>
            <h3>Assistant IA</h3>
            <span className="status">En ligne</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">{message.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={action.action}
            >
              {action.label}
            </button>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Posez votre question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            aria-label="Envoyer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
