import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Programs from "./scenes/programs";
import Course from "./scenes/course";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Program from "./scenes/program";
import Generated from "./scenes/generated";
import Recommendation from "./scenes/recommendation";
import Login from "./scenes/auth"; // Import the login component
import SessionManager from "./util/Session"; // Import the session manager
import {
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Box,
} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUDyXBYoLESgG9ecLo3qUrWbxS5KhTM2c",
  authDomain: "eduprogrammaker.firebaseapp.com",
  projectId: "eduprogrammaker",
  storageBucket: "eduprogrammaker.firebasestorage.app",
  messagingSenderId: "961124674211",
  appId: "1:961124674211:web:2c1e056837b39d39e3ad16",
  measurementId: "G-7CW3ZXMXJC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  
  // Add a state to track authentication status globally
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Session Manager */}
        <SessionManager />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main
            className="content"
            style={{ width: isLoginPage ? "100%" : undefined }}
          >
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              {/* Login route - redirect to dashboard if already authenticated */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Course />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/program"
                element={
                  <ProtectedRoute>
                    <Programs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/program/:program_id"
                element={
                  <ProtectedRoute>
                    <Generated />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendation/:program_id"
                element={
                  <ProtectedRoute>
                    <Recommendation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/form"
                element={
                  <ProtectedRoute>
                    <Form />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute>
                    <FAQ />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all unknown routes and redirect based on authentication status */}
              <Route 
                path="*" 
                element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} 
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;