import React, { useState } from 'react';
import ChatBot from './ChatBot';

interface FormData {
  language: string;
  soilType: string;
  pHLevel: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  rainfall: string;
  temperature: string;
  cropType: string;
}

const FertilizerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    language: 'en',
    soilType: 'clay',
    pHLevel: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    rainfall: '',
    temperature: '',
    cropType: '',
  });
  const [result, setResult] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "system", content: "You are AgriBot, an AI assistant specialized in sustainable farming and fertilizer recommendations." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const getRecommendation = async () => {
    const { language, soilType, pHLevel, nitrogen, phosphorus, potassium, cropType, rainfall, temperature } = formData;
    
    if (!pHLevel || !nitrogen || !phosphorus || !potassium || !cropType || !rainfall || !temperature) {
      alert('Please fill out all fields.');
      return;
    }

    setIsLoading(true);
    const query = `Recommend the optimal fertilizer type and quantity for ${cropType} in ${soilType} soil with pH ${pHLevel}, nitrogen ${nitrogen}, phosphorus ${phosphorus}, potassium ${potassium}, rainfall ${rainfall} cm, and temperature ${temperature}°C, ensuring sustainability. Translate the response into ${language} language and give the final response only in ${language}.`;
    
    const updatedHistory = [...chatHistory, { role: "user", content: query }];
    setChatHistory(updatedHistory);

    try {
      const response = await fetchGPT(language, updatedHistory);
      setResult(response);
      setShowChat(true);
      setChatHistory([...updatedHistory, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGPT = async (language: string, history: any[]) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: history
        })
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || `I'm sorry, I couldn't process your request in ${language}.`;
    } catch (error) {
      console.error("Error fetching GPT response:", error);
      return "An error occurred. Please try again later.";
    }
  };

  return (
    <>
      <form className="fertilizer-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="language">Select Language:</label>
          <select id="language" value={formData.language} onChange={handleInputChange}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
            <option value="mr">Marathi</option>
            <option value="bn">Bengali</option>
            <option value="gu">Gujarati</option>
            <option value="pa">Punjabi</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="soilType">Soil Type:</label>
          <select id="soilType" value={formData.soilType} onChange={handleInputChange}>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pHLevel">Soil pH Level:</label>
          <input
            type="number"
            id="pHLevel"
            value={formData.pHLevel}
            onChange={handleInputChange}
            step="0.1"
            min="0"
            max="14"
            placeholder="Enter pH level (0-14)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nitrogen">Nitrogen (N) Content (ppm):</label>
          <input
            type="number"
            id="nitrogen"
            value={formData.nitrogen}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter nitrogen content"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phosphorus">Phosphorus (P) Content (ppm):</label>
          <input
            type="number"
            id="phosphorus"
            value={formData.phosphorus}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter phosphorus content"
          />
        </div>

        <div className="form-group">
          <label htmlFor="potassium">Potassium (K) Content (ppm):</label>
          <input
            type="number"
            id="potassium"
            value={formData.potassium}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter potassium content"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rainfall">Rainfall (cm):</label>
          <input
            type="number"
            id="rainfall"
            value={formData.rainfall}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter rainfall in cm"
          />
        </div>

        <div className="form-group">
          <label htmlFor="temperature">Temperature (°C):</label>
          <input
            type="number"
            id="temperature"
            value={formData.temperature}
            onChange={handleInputChange}
            min="-50"
            max="50"
            placeholder="Enter temperature in °C"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cropType">Crop Type:</label>
          <input
            type="text"
            id="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            placeholder="Enter crop type"
          />
        </div>

        <button 
          type="button" 
          onClick={getRecommendation}
          disabled={isLoading}
          style={{ gridColumn: '1 / -1' }}
        >
          {isLoading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Fertilizer Recommendation</h3>
          <p>{result}</p>
        </div>
      )}

      {showChat && (
        <ChatBot
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          language={formData.language}
        />
      )}
    </>
  );
};

export default FertilizerForm; 