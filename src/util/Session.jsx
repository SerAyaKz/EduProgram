// Create a new file called SessionManager.js

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const SessionManager = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // Check if user is logged in
    if (!auth.currentUser) {
      return;
    }
    
    // Initialize session timeout if not already set
    if (!localStorage.getItem('sessionExpirationTime')) {
      const expirationTime = Date.now() + SESSION_TIMEOUT;
      localStorage.setItem('sessionExpirationTime', expirationTime.toString());
    }
    
    // Set up the timer check
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const expirationTime = parseInt(localStorage.getItem('sessionExpirationTime') || '0');
      
      if (currentTime >= expirationTime) {
        // Time's up, log the user out
        clearInterval(intervalId);
        auth.signOut()
          .then(() => {
            localStorage.removeItem('dbUser');
            localStorage.removeItem('sessionStartTime');
            localStorage.removeItem('sessionExpirationTime');
            navigate('/login');
            alert("Your session has expired. Please log in again.");
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      }
    }, 30000); // Check every 30 seconds
    
    // Reset timer on user activity
    const resetTimer = () => {
      if (auth.currentUser) {
        const expirationTime = Date.now() + SESSION_TIMEOUT;
        localStorage.setItem('sessionExpirationTime', expirationTime.toString());
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [auth, navigate]);
  
  return null; // This component doesn't render anything
};

export default SessionManager;