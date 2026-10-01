import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Chatbot from '../Chatbot/Chatbot';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const openLuna = () => setIsChatbotOpen(true);
    window.addEventListener('energieplus:open-luna', openLuna);
    return () => window.removeEventListener('energieplus:open-luna', openLuna);
  }, []);

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
      <button
        className="chatbot-toggle"
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        aria-label="Ouvrir l'assistant Luna"
      >
        <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 5.5h10A3.5 3.5 0 0 1 20.5 9v4A3.5 3.5 0 0 1 17 16.5h-5l-3.5 3v-3H7A3.5 3.5 0 0 1 3.5 13V9A3.5 3.5 0 0 1 7 5.5Z" />
          <path d="M12 5.5v-2" />
          <circle cx="9" cy="11" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="15" cy="11" r="0.7" fill="currentColor" stroke="none" />
          <path d="M9.5 13.5c1 .7 2.5.7 3.5 0" />
        </svg>
      </button>
    </div>
  );
};

export default Layout;
