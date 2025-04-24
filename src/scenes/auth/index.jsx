import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged 
} from "firebase/auth";
import { Box, Button, Typography, useTheme } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { tokens } from "../../theme";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  // Check if user is already logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/");
    }
  });

  const setupSessionTimeout = () => {
    const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // Set the expiration time
    const expirationTime = Date.now() + SESSION_TIMEOUT;
    localStorage.setItem('sessionExpirationTime', expirationTime.toString());
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Firebase authentication
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      
      // Register user in the backend using fetch
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0,
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          title: "",
          roleId: 1
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register user in the backend');
      }
      const userData = await response.json();
      localStorage.setItem('dbUser', JSON.stringify(userData));
      localStorage.setItem('sessionStartTime', Date.now().toString());
    
      // Set up the session timeout
      setupSessionTimeout();
      navigate("/");
    } catch (error) {
      // Handle authentication errors
      console.error("Error during authentication:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in canceled. Please try again.");
      } else {
        setError(`Authentication failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundColor: colors.primary[400],
      }}
    >
      <Box
        width="400px"
        p="40px"
        borderRadius="8px"
        backgroundColor={colors.primary[500]}
        boxShadow="0px 10px 40px -10px rgba(0,0,0,0.2)"
      >
        <Typography variant="h2" textAlign="center" mb="20px">
          Welcome to EduProgramMaker
        </Typography>
        <Typography variant="h5" textAlign="center" mb="30px" color={colors.greenAccent[400]}>
          Sign in to access your dashboard
        </Typography>
        
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          disabled={loading}
          sx={{
            backgroundColor: "#4285F4",
            color: "white",
            padding: "12px",
            "&:hover": {
              backgroundColor: "#357ae8",
            },
          }}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </Button>
        
        {error && (
          <Typography color="error" mt="20px" textAlign="center">
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Login;