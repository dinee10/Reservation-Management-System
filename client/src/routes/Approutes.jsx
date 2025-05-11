import { useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Chatbot from '../components/chatbot/chatbot'; 
import '../App.css';

function AppRoutes() {
    const [count, setCount] = useState(0); // Note: Unused state, consider removing

    return (
        <Router>
            <div>
                {/* Chatbot component, rendered globally */}
                <Chatbot />
                
                
            </div>
        </Router>
    );
}

export default AppRoutes;