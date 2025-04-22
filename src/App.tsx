import React, { useState } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import FertilizerForm from './components/FertilizerForm';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {showWelcome ? (
          <Welcome onGetStarted={handleGetStarted} />
        ) : (
          <div className="container">
            <h1>🌱 AI-Powered Fertilizer Recommendation</h1>
            <FertilizerForm />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App; 