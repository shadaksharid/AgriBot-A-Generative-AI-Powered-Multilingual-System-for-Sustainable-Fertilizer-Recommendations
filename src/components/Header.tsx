import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <h1>AgriBot</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="./Welcome">Home</a></li>
            <li><a href="./Welcome">About</a></li>
            <li><a href="./Welcome">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
