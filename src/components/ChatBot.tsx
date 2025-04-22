import React, { useState, useRef, useEffect } from 'react';

interface ChatBotProps {
  chatHistory: Array<{ role: string; content: string }>;
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ role: string; content: string }>>>;
  language: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ chatHistory, setChatHistory, language }) => {
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: chatInput + ` (Translate the response into ${language} language and give the final response only in ${language}.)` }
    ];
    setChatHistory(updatedHistory);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetchGPT(language, updatedHistory);
      setChatHistory([...updatedHistory, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...updatedHistory,
        { role: "assistant", content: "I apologize, but I encountered an error. Please try again." }
      ]);
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
    <div className="chat-container">
      <h3>Chat with AgriBot 🤖</h3>
      <div className="chatbox" ref={chatboxRef}>
        {chatHistory.filter(msg => msg.role !== "system").map((message, index) => (
          <div
            key={index}
            className={`${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-input"
          placeholder="Ask further questions..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !chatInput.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot; 