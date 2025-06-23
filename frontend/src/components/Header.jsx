import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title = "Jarvis Delivers", backTo = "/home", backText = "← Back" }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md w-full">
      <div className="w-full px-8 py-4">
        <div className="flex items-center space-x-4">
          {/* Back button */}
          <button
            onClick={() => navigate(backTo)}
            className="text-white hover:text-white transition-all duration-300 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-110 hover:-translate-y-1 text-base"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              minWidth: '120px',
              height: '48px'
            }}
          >
            {backText}
          </button>
            {/* Page title */}
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
