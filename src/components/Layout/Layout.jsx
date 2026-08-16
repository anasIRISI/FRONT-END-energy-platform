import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Chatbot from '../Chatbot/Chatbot';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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
        aria-label="Toggle chatbot"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18C11.45 18 11 17.55 11 17V11C11 10.45 11.45 10 12 10C12.55 10 13 10.45 13 11V17C13 17.55 12.55 18 12 18ZM13 8H11V6H13V8Z" />
        </svg>
      </button>
    </div>
  );
};

export default Layout;
