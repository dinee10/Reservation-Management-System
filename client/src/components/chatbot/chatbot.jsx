import { useState } from "react";
import axios from "axios";

import voice from '../chatbot/img/song_mic_microphone_sound_voice_google_icon_228397.png';

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  async function generateAnswer() {
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }
    setAnswer("Typing... ⏳");
    console.log("Question:", question);
    console.log("API Key:", import.meta.env.VITE_GEMINI_API_KEY);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      console.log("API Response:", response.data);
      setAnswer(response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response text found.");
    } catch (error) {
      console.error("Error fetching response:", error.response?.data || error.message);
      setAnswer(`⚠️ Error: ${error.response?.data?.error?.message || "Failed to generate response. Please try again."}`);
    }
  }

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAnswer("⚠️ Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = function (e) {
      const transcript = e.results[0][0].transcript;
      setQuestion(transcript);
    };

    recognition.onerror = function (e) {
      console.error("Speech recognition error:", e);
      setAnswer("⚠️ Error with speech recognition. Please try again.");
    };
  };

  return (
    <div>
      <button
        className="toggle-chatbot-button"
        onClick={() => setIsChatbotVisible(!isChatbotVisible)}
      >
        {isChatbotVisible ? "Close Chatbot" : "Open Chatbot"}
      </button>

      {isChatbotVisible && (
        <div className="chatbot-popup">
          <div className="chatbot-box">
            <h2 className="chatbot-title">🤖 AI Assistance</h2>

            <div className="voice">
              <button className="speaker" onClick={startVoiceRecognition}>
                Voice Controller
              </button>
              <img className="voice-image" src={voice} width="30px" alt="Voice Icon" />
            </div>

            <textarea
              className="chatbot-textarea"
              placeholder="Type your Destination and trip Duration..."
              rows="3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>

            <button className="chatbot-button" onClick={generateAnswer}>
              Generate Response
            </button>

            <div className="chatbot-response">
              {answer ? (
                <ul>
                  {answer.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Your packing list will appear here...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;