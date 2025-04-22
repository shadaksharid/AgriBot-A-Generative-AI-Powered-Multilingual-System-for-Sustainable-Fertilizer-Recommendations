import React from 'react';
import './Welcome.css';

interface WelcomeProps {
  onGetStarted: () => void;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted }) => {
  const features: Feature[] = [
    {
      icon: '🌱',
      title: 'Smart Fertilizer Recommendations',
      description: 'Get personalized fertilizer recommendations based on your crop type and soil conditions.'
    },
    {
      icon: '🧮',
      title: 'Precise Calculations',
      description: 'Calculate exact amounts of fertilizers needed for optimal crop growth.'
    },
    {
      icon: '📊',
      title: 'Cost Analysis',
      description: 'Understand the cost implications of different fertilizer options.'
    },
    {
      icon: '💡',
      title: 'Expert Insights',
      description: 'Access agricultural best practices and expert advice for better yields.'
    }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to AgriBot</h1>
        <p className="welcome-subtitle">
          Your intelligent assistant for smart fertilizer management and crop optimization
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <button className="get-started-button" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome; 