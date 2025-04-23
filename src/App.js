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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main
            className="content"
            style={{ width: isLoginPage ? "100%" : undefined }}
          >
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/login" element={<Login />} />

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
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
