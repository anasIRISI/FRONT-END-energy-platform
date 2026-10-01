import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVisiteur, getAvailableAppointmentSlots, getChatbotIdentity, getRegions, sendChatMessage } from '../../services/api';
import { productPath, simulationPath } from '../../utils/routes';
import './Chatbot.css';

const GUIDED_ADVICE_CHOICES = [
  { label: 'Réduire ma facture', question: 'Quelle dépense souhaitez-vous surtout réduire ?', details: [
    { label: 'Électricité', reply: 'Les panneaux solaires réduisent l’électricité achetée au réseau. Ils sont adaptés si votre toiture reçoit bien le soleil.', products: [{ label: 'Découvrir les panneaux solaires', to: productPath('Pack panneaux photovoltaïques 6 kWc') }] },
    { label: 'Chauffage', reply: 'Pour diminuer une facture de chauffage, une pompe à chaleur peut être pertinente si le logement est correctement isolé.', products: [{ label: 'Découvrir la pompe à chaleur', to: productPath('Pompe à chaleur air/eau') }] },
  ] },
  { label: 'Mieux me chauffer', question: 'Quel chauffage utilisez-vous aujourd’hui ?', details: [
    { label: 'Gaz ou mazout', reply: 'Une pompe à chaleur peut remplacer le gaz ou le mazout avec moins d’énergie. Une bonne isolation améliore son efficacité.', products: [{ label: 'Découvrir la pompe à chaleur', to: productPath('Pompe à chaleur air/eau') }] },
    { label: 'Électricité', reply: 'Avant de changer le chauffage, vérifiez d’abord les pertes de chaleur. L’isolation de toiture est souvent une priorité utile.', products: [{ label: 'Découvrir l’isolation de toiture', to: productPath('Isolation toiture 100 m²') }] },
  ] },
  { label: 'Éviter les pièces froides', question: 'Où ressentez-vous surtout le froid ?', details: [
    { label: 'Sous le toit', reply: 'L’isolation de la toiture limite les pertes de chaleur et améliore rapidement le confort des pièces sous le toit.', products: [{ label: 'Découvrir l’isolation de toiture', to: productPath('Isolation toiture 100 m²') }] },
    { label: 'Dans plusieurs pièces', reply: 'Une isolation efficace réduit les pertes de chaleur et rend le logement plus homogène et confortable.', products: [{ label: 'Découvrir l’isolation de toiture', to: productPath('Isolation toiture 100 m²') }] },
  ] },
  { label: 'Produire mon électricité', question: 'Avez-vous déjà des panneaux solaires ?', details: [
    { label: 'Oui', reply: 'Une batterie peut conserver une partie de votre production solaire pour l’utiliser le soir.', products: [{ label: 'Découvrir la batterie', to: productPath('Batterie résidentielle 10 kWh') }] },
    { label: 'Non', reply: 'Les panneaux solaires produisent de l’électricité pour votre logement et réduisent l’énergie achetée au réseau.', products: [{ label: 'Découvrir les panneaux solaires', to: productPath('Pack panneaux photovoltaïques 6 kWc') }] },
  ] },
];

const ADVICE_HOME_TYPES = [
  { label: 'Maison' },
  { label: 'Appartement' },
];

const ADVICE_REGIONS = [
  { label: 'Wallonie' },
  { label: 'Bruxelles' },
  { label: 'Flandre' },
];

const isEnergyHousingQuestion = (value) => /logement|maison|appartement|chauffage|facture|isolation|toiture|panneau|solaire|batterie|pompe à chaleur|énergie|energie/i.test(String(value));

const formatLocalDate = (value) => [
  value.getFullYear(),
  String(value.getMonth() + 1).padStart(2, '0'),
  String(value.getDate()).padStart(2, '0'),
].join('-');

// Solution de secours volontaire : un rendez-vous peut toujours commencer
// même si la liste dynamique des régions est momentanément indisponible.
const DEFAULT_REGIONS = [
  { id: 1, nom: 'Wallonie' },
  { id: 2, nom: 'Bruxelles' },
  { id: 3, nom: 'Flandre' },
];

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis Luna, votre assistante énergie. Comment puis-je vous aider aujourd’hui ?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [workflowActions, setWorkflowActions] = useState([]);
  const [showAppointmentPicker, setShowAppointmentPicker] = useState(false);
  const [appointmentDraft, setAppointmentDraft] = useState({ date: '', heure: '' });
  const [appointmentToModify, setAppointmentToModify] = useState(null);
  const [appointmentContact, setAppointmentContact] = useState({ email: '', regionId: '' });
  const [isSavingAppointmentContact, setIsSavingAppointmentContact] = useState(false);
  // Les régions belges sont connues par l'application : elles sont visibles
  // dès l'ouverture du formulaire, sans attendre la réponse réseau.
  const [regions, setRegions] = useState(DEFAULT_REGIONS);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showGuidedChoices, setShowGuidedChoices] = useState(true);
  const [isAdviceGuidanceActive, setIsAdviceGuidanceActive] = useState(false);
  const [adviceDraft, setAdviceDraft] = useState({});
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const resolveProductDestination = (action) => {
    const actionLabel = String(action?.label || '').toLowerCase();
    if (action?.to && action.to !== '/catalogue' && !/^\/produit\/\d+$/.test(action.to)) return action.to;
    if (actionLabel.includes('pompe')) return productPath('Pompe à chaleur air/eau');
    if (actionLabel.includes('isolation')) return productPath('Isolation toiture 100 m²');
    if (actionLabel.includes('batterie')) return productPath('Batterie résidentielle 10 kWh');
    if (actionLabel.includes('panneau')) return productPath('Pack panneaux photovoltaïques 6 kWc');
    return action?.to || '/catalogue';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Un choix qui mène vers un parcours dédié ne laisse pas une discussion
  // ouverte au-dessus du formulaire, du catalogue ou du rendez-vous.
  const redirectAndCloseLuna = (destination) => {
    setWorkflowActions([]);
    setShowAppointmentPicker(false);
    setShowGuidedChoices(true);
    setIsAdviceGuidanceActive(false);
    setAdviceDraft({});
    setInputValue('');
    setRequestError('');
    onClose?.();
    navigate(destination);
  };

  const addLunaMessage = (text) => {
    setMessages((previous) => [...previous, {
      id: `${Date.now()}-luna-${Math.random()}`, text, sender: 'bot', timestamp: new Date(),
    }]);
  };

  const startAdviceGuide = () => {
    setIsAdviceGuidanceActive(true);
    setAdviceDraft({});
    addLunaMessage('Bien sûr. Quel résultat souhaitez-vous obtenir ?');
    setWorkflowActions([{ type: 'choose_advice_need', choices: GUIDED_ADVICE_CHOICES }]);
  };

  const chooseAdviceNeed = (choice) => {
    setMessages((previous) => [...previous, {
      id: `${Date.now()}-visitor-${Math.random()}`, text: choice.label, sender: 'user', timestamp: new Date(),
    }]);
    addLunaMessage(choice.question);
    setWorkflowActions([{ type: 'choose_advice_detail', choices: choice.details }]);
  };

  const chooseAdviceDetail = (choice) => {
    setAdviceDraft((current) => ({ ...current, solution: choice }));
    setMessages((previous) => [...previous, {
      id: `${Date.now()}-visitor-${Math.random()}`, text: choice.label, sender: 'user', timestamp: new Date(),
    }]);
    addLunaMessage('Merci. Quel type de logement souhaitez-vous améliorer ?');
    setWorkflowActions([{ type: 'choose_advice_home', choices: ADVICE_HOME_TYPES }]);
  };

  const chooseAdviceHome = (choice) => {
    setAdviceDraft((current) => ({ ...current, logement: choice.label }));
    setMessages((previous) => [...previous, {
      id: `${Date.now()}-visitor-${Math.random()}`, text: choice.label, sender: 'user', timestamp: new Date(),
    }]);
    addLunaMessage('Dans quelle région se situe votre logement ?');
    setWorkflowActions([{ type: 'choose_advice_region', choices: ADVICE_REGIONS }]);
  };

  const chooseAdviceRegion = (choice) => {
    const selectedSolution = adviceDraft.solution;
    setIsAdviceGuidanceActive(false);
    setAdviceDraft({});
    setMessages((previous) => [...previous, {
      id: `${Date.now()}-visitor-${Math.random()}`, text: choice.label, sender: 'user', timestamp: new Date(),
    }]);
    addLunaMessage(`Pour votre ${adviceDraft.logement?.toLowerCase() || 'logement'} en ${choice.label}, ${selectedSolution?.reply || 'je vous conseille de vérifier la solution adaptée ci-dessous.'}`);
    addLunaMessage('Un rendez-vous avec un conseiller permettra de confirmer ce choix selon votre logement et votre budget.');
    setWorkflowActions([{ type: 'choose_product_details', products: selectedSolution?.products || [] }]);
  };

  const assistantChoices = [
    { icon: '☀️', label: 'Simulation', description: 'Estimer mon projet', action: () => startSimulationConversation() },
    { icon: '📅', label: 'Rendez-vous', description: 'Choisir un créneau', action: () => startAppointmentConversation() },
    { icon: '💡', label: 'Conseil', description: 'Être accompagné', action: startAdviceGuide },
  ];

  const showWelcomeChoices = showGuidedChoices && !isTyping && !showAppointmentPicker;

  const handleSendMessage = async (text = inputValue, workflow = {}) => {
    if (!text.trim()) return;

    if ((isAdviceGuidanceActive || isEnergyHousingQuestion(text)) && !workflow.action) {
      setMessages((previous) => [...previous, {
        id: Date.now(), text, sender: 'user', timestamp: new Date(),
      }]);
      setInputValue('');
      setShowGuidedChoices(false);
      setRequestError('');
      addLunaMessage('Pour trouver la solution adaptée à votre logement, choisissez ce qui vous gêne le plus :');
      setWorkflowActions([{ type: 'choose_advice_need', choices: GUIDED_ADVICE_CHOICES }]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowGuidedChoices(false);
    setRequestError('');
    setWorkflowActions([]);
    setIsTyping(true);

    try {
      const identity = getChatbotIdentity();
      const response = await sendChatMessage(text, conversationId, identity.visiteurId, workflow);
      if (response && response.conversationId) {
        setConversationId(response.conversationId);
      }
      const responseText = response?.reply || response?.contenu || generateBotResponse(text);
      const actions = Array.isArray(response?.actions) ? response.actions : [];
      const appointmentFinished = actions.some((action) => action.type === 'appointment_created' || action.type === 'appointment_cancelled');
      setWorkflowActions(actions.filter((action) => action.type !== 'appointment_created' && action.type !== 'appointment_cancelled'));
      if (appointmentFinished) {
        setAppointmentToModify(null);
        setShowGuidedChoices(true);
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      // Après un conflit de créneau, Luna affiche immédiatement les choix mis
      // à jour au lieu d'exposer une erreur HTTP ou de demander un clic de plus.
      const unavailableSlot = actions.find((action) => action.type === 'open_appointment_form');
      if (unavailableSlot?.date) {
        setWorkflowActions([]);
        openAppointmentPicker(unavailableSlot.date);
      }
    } catch (err) {
      console.warn('Mode assistant local pour chatbot:', err.message);
      const botResponse = generateBotResponse(text);
      setRequestError('Réponse locale affichée : le service IA est momentanément indisponible.');
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

  const handleWorkflowAction = (action) => {
    if (action.type === 'navigate') {
      redirectAndCloseLuna(resolveProductDestination(action));
      return;
    }
    if (action.type === 'select_region') {
      redirectAndCloseLuna('/formulaire');
      return;
    }
    if (action.type === 'open_appointment_form') {
      openAppointmentPicker(action.date);
      return;
    }
    if (action.type === 'choose_product') {
      redirectAndCloseLuna('/formulaire');
      return;
    }
    if (action.type === 'simulation_created' && action.referencePublique) {
      redirectAndCloseLuna(simulationPath(action));
      return;
    }
    if (action.type === 'confirm_simulation') {
      handleSendMessage('Je confirme la simulation.', {
        action: 'simulation',
        produitId: action.produitId,
        formulaireId: action.formulaireId,
        confirme: true,
      });
      return;
    }
    if (action.type === 'confirm_appointment') {
      handleSendMessage('Je confirme le rendez-vous.', {
        action: 'rendez_vous',
        rendezVous: { date: action.date, heure: action.heure },
        confirme: true,
      });
      return;
    }
    if (action.type === 'modify_appointment' && action.rendezVousId) {
      setWorkflowActions([]);
      setAppointmentToModify(action.rendezVousId);
      setMessages((previous) => [...previous,
        { id: Date.now(), sender: 'user', timestamp: new Date(), text: 'Je souhaite modifier mon créneau.' },
        { id: Date.now() + 1, sender: 'bot', timestamp: new Date(), text: 'Bien sûr. Choisissez un nouveau jour et un nouveau créneau.' },
      ]);
      openAppointmentPicker();
      return;
    }
    if (action.type === 'cancel_appointment' && action.rendezVousId) {
      handleSendMessage('Je souhaite annuler mon rendez-vous.', {
        action: 'annuler_rendez_vous',
        rendezVousId: action.rendezVousId,
      });
    }
  };

  const selectAppointmentSlot = (heure) => {
    const appointment = { ...appointmentDraft, heure };
    const appointmentId = appointmentToModify;
    setAppointmentDraft(appointment);
    setAppointmentToModify(null);
    setShowAppointmentPicker(false);
    handleSendMessage(
      appointmentId ? `Je souhaite déplacer mon rendez-vous au ${appointment.date} à ${appointment.heure}.` : `Je souhaite un rendez-vous le ${appointment.date} à ${appointment.heure}.`,
      appointmentId
        ? { action: 'modifier_rendez_vous', rendezVousId: appointmentId, rendezVous: appointment }
        : { action: 'rendez_vous', rendezVous: appointment, confirme: true },
    );
  };

  const nextBusinessDays = Array.from({ length: 7 }, (_, offset) => {
    const value = new Date();
    value.setDate(value.getDate() + offset + 1);
    return value;
  }).filter((value) => value.getDay() !== 0 && value.getDay() !== 6).slice(0, 5);

  const openAppointmentPicker = async (preferredDate = '') => {
    setRequestError('');
    setShowAppointmentPicker(true);
    if (!getChatbotIdentity().visiteurId) {
      try {
        const loadedRegions = await getRegions();
        setRegions(Array.isArray(loadedRegions) && loadedRegions.length > 0 ? loadedRegions : DEFAULT_REGIONS);
      } catch {
        setRegions(DEFAULT_REGIONS);
      }
    }
    if (preferredDate && getChatbotIdentity().visiteurId) {
      chooseAppointmentDate(preferredDate);
    }
  };

  const startAppointmentConversation = () => {
    setAppointmentToModify(null);
    setMessages((previous) => [...previous,
      { id: Date.now(), sender: 'user', timestamp: new Date(), text: 'Je souhaite prendre rendez-vous.' },
      {
        id: Date.now() + 1,
        sender: 'bot',
        timestamp: new Date(),
        text: getChatbotIdentity().visiteurId
          ? 'D’accord. Choisissez un jour, puis un créneau.'
          : 'D’accord. Indiquez votre e-mail et choisissez votre région.',
      },
    ]);
    openAppointmentPicker();
  };

  const cancelAppointment = () => {
    setShowAppointmentPicker(false);
    setAppointmentDraft({ date: '', heure: '' });
    setAvailableSlots([]);
    setRequestError('');
    setMessages((previous) => [...previous, {
      id: Date.now(), sender: 'bot', timestamp: new Date(),
      text: 'Aucun souci. Que souhaitez-vous faire maintenant ?',
    }]);
    setShowGuidedChoices(true);
  };

  const chooseAppointmentDate = async (selectedDate) => {
    setAppointmentDraft({ date: selectedDate, heure: '' });
    setAvailableSlots([]);
    setIsLoadingSlots(true);
    try {
      setAvailableSlots(await getAvailableAppointmentSlots(selectedDate));
    } catch {
      setRequestError('Impossible de charger les créneaux pour le moment. Réessayez dans un instant.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const createAppointmentVisitor = async (contact = appointmentContact) => {
    if (!contact.email || !contact.regionId || isSavingAppointmentContact) return;
    if (!isValidEmail(contact.email)) {
      setRequestError('Saisissez une adresse e-mail valide, par exemple nom@exemple.com.');
      return;
    }
    setRequestError('');
    setIsSavingAppointmentContact(true);
    try {
      const visitor = await createVisiteur({
        profil: 'PARTICULIER',
        email: contact.email,
        regionId: Number(contact.regionId),
      });
      localStorage.setItem('energieplus_visiteur_id', String(visitor.id));
      setMessages((previous) => [...previous, {
        id: Date.now(), sender: 'bot', timestamp: new Date(),
        text: 'Merci. Vos coordonnées sont enregistrées. Choisissez maintenant un jour et un créneau libre.',
      }]);
    } catch (error) {
      const backendMessage = error?.response?.data?.message || error?.response?.data?.detail;
      setRequestError(backendMessage || 'Impossible d’enregistrer vos coordonnées pour le moment. Réessayez dans un instant.');
    } finally {
      setIsSavingAppointmentContact(false);
    }
  };

  const chooseAppointmentRegion = (regionId) => {
    const contact = { ...appointmentContact, regionId };
    setAppointmentContact(contact);
    // Le choix de la région est la validation explicite de cette mini-étape :
    // aucune action supplémentaire n’est demandée au visiteur.
    createAppointmentVisitor(contact);
  };

  const startSimulationConversation = () => {
    redirectAndCloseLuna('/formulaire');
  };

  const selectRegionInChat = (region) => {
    handleSendMessage(`Mon projet se situe en ${region}. Je souhaite connaître les solutions et aides adaptées.`);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    return "Le service d'assistance est indisponible. Réessayez dans un instant ou utilisez le catalogue et le formulaire de simulation.";
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 5.5h10A3.5 3.5 0 0 1 20.5 9v4A3.5 3.5 0 0 1 17 16.5h-5l-3.5 3v-3H7A3.5 3.5 0 0 1 3.5 13V9A3.5 3.5 0 0 1 7 5.5Z" />
              <path d="M12 5.5v-2" />
              <circle cx="9" cy="11" r="0.7" fill="currentColor" stroke="none" />
              <circle cx="15" cy="11" r="0.7" fill="currentColor" stroke="none" />
              <path d="M9.5 13.5c1 .7 2.5.7 3.5 0" />
            </svg>
          </div>
          <div>
            <h3>Luna</h3>
            <span className="status"><span className="status-dot"></span>En ligne · Belgique</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          <div className="chatbot-context">
            <span>⚡</span>
            <p>Conseils, simulations et rendez-vous, adaptés à votre projet.</p>
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <time dateTime={message.timestamp.toISOString()}>
                  {message.timestamp.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
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
          {workflowActions.length > 0 && (
            <div className="chatbot-workflow-actions" aria-label="Actions proposées par l'assistant">
              {workflowActions.map((action, index) => (
                action.type === 'select_region' && Array.isArray(action.regions) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Choisissez votre région :</span>
                    {action.regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        className="chatbot-workflow-button"
                        onClick={() => selectRegionInChat(region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                ) : action.type === 'choose_comparison_need' && Array.isArray(action.choices) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Votre besoin principal :</span>
                    {action.choices.map((choice) => (
                      <button
                        key={choice.label}
                        type="button"
                        className="chatbot-workflow-button"
                        onClick={() => handleSendMessage(choice.message)}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : action.type === 'choose_advice_need' && Array.isArray(action.choices) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Votre priorité :</span>
                    {action.choices.map((choice) => (
                      <button
                        key={choice.label}
                        type="button"
                        className="chatbot-workflow-button"
                        onClick={() => (choice.details ? chooseAdviceNeed(choice) : handleSendMessage(choice.message))}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : action.type === 'choose_advice_detail' && Array.isArray(action.choices) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Votre situation :</span>
                    {action.choices.map((choice) => (
                      <button
                        key={choice.label}
                        type="button"
                        className="chatbot-workflow-button"
                        onClick={() => chooseAdviceDetail(choice)}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : action.type === 'choose_advice_home' && Array.isArray(action.choices) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Votre logement :</span>
                    {action.choices.map((choice) => (
                      <button key={choice.label} type="button" className="chatbot-workflow-button" onClick={() => chooseAdviceHome(choice)}>{choice.label}</button>
                    ))}
                  </div>
                ) : action.type === 'choose_advice_region' && Array.isArray(action.choices) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Votre région :</span>
                    {action.choices.map((choice) => (
                      <button key={choice.label} type="button" className="chatbot-workflow-button" onClick={() => chooseAdviceRegion(choice)}>{choice.label}</button>
                    ))}
                  </div>
                ) : action.type === 'choose_product_details' && Array.isArray(action.products) ? (
                  <div className="chatbot-region-choices" key={`${action.type}-${index}`}>
                    <span>Voir le produit qui vous intéresse :</span>
                    {action.products.map((product) => (
                      <button
                        key={product.to}
                        type="button"
                        className="chatbot-workflow-button"
                        onClick={() => redirectAndCloseLuna(product.to)}
                      >
                        {product.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="chatbot-workflow-button"
                      onClick={() => openAppointmentPicker()}
                    >
                      Prendre rendez-vous
                    </button>
                  </div>
                ) : (
                  <button
                    key={`${action.type}-${index}`}
                    type="button"
                    className="chatbot-workflow-button"
                    onClick={() => handleWorkflowAction(action)}
                  >
                    {action.label || 'Continuer'}
                  </button>
                )
              ))}
            </div>
          )}
          {showAppointmentPicker && (
            <div className="chatbot-appointment-picker">
              <p>{getChatbotIdentity().visiteurId ? '1. Jour · 2. Créneau' : 'E-mail et région, puis jour et créneau.'}</p>
              {!getChatbotIdentity().visiteurId && (
                <div className="chatbot-contact-fields">
                  <label>E-mail de contact<input type="email" required value={appointmentContact.email} onChange={(event) => setAppointmentContact((current) => ({ ...current, email: event.target.value }))} /></label>
                  <label>Région du projet<select required value={appointmentContact.regionId} onChange={(event) => chooseAppointmentRegion(event.target.value)}><option value="">Choisir une région</option>{regions.map((region) => <option key={region.id} value={region.id}>{region.nom}</option>)}</select></label>
                  <p className="chatbot-contact-hint">{isSavingAppointmentContact ? 'Enregistrement de vos coordonnées…' : 'Vos coordonnées sont enregistrées automatiquement après le choix de la région.'}</p>
                </div>
              )}
              {getChatbotIdentity().visiteurId && <>
                <div className="chatbot-date-choices" aria-label="Jours disponibles">{nextBusinessDays.map((day) => { const value = formatLocalDate(day); return <button className={appointmentDraft.date === value ? 'selected' : ''} key={value} type="button" onClick={() => chooseAppointmentDate(value)}>{day.toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric', month: 'short' })}</button>; })}</div>
                {isLoadingSlots && <p>Recherche des créneaux libres…</p>}
                {!isLoadingSlots && appointmentDraft.date && availableSlots.length === 0 && <p>Aucun créneau libre ce jour. Choisissez un autre jour.</p>}
                {availableSlots.length > 0 && <div className="chatbot-slot-choices" aria-label="Créneaux disponibles">{availableSlots.map((slot) => <button className={appointmentDraft.heure === slot ? 'selected' : ''} key={slot} type="button" onClick={() => selectAppointmentSlot(slot)}>{slot}</button>)}</div>}
              </>}
              <div className="chatbot-appointment-actions">
                <button type="button" onClick={cancelAppointment}>Annuler</button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showWelcomeChoices && (
          <section className="chatbot-assistant-choices" aria-label="Comment Luna peut vous aider">
            <p>Choisissez une option pour commencer</p>
            <div className="chatbot-choice-grid">
              {assistantChoices.map((choice) => (
                <button key={choice.label} type="button" onClick={() => { setShowGuidedChoices(false); choice.action(); }}>
                  <span className="chatbot-choice-icon" aria-hidden="true">{choice.icon}</span>
                  <span><strong>{choice.label}</strong><small>{choice.description}</small></span>
                  <span className="chatbot-choice-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="chatbot-input">
          {requestError && <p className="chatbot-error" role="status">{requestError}</p>}
          <input
            type="text"
            placeholder="Posez votre question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            aria-label="Votre question pour Luna"
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
