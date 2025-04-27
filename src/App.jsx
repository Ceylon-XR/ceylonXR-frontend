import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, createContext, useEffect, useContext } from "react";
import NavBar from "./components/UI/Navbar";
import Footer from "./components/UI/Footer";
import ScenePage from "./components/UI/ScenePage";
import Home from "./components/UI/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Profile from "./components/Auth/Profile";
import { getCurrentUser, handleGoogleCallback } from "./api/auth";

// Create authentication context
export const AuthContext = createContext(null);

// Google OAuth callback handler component
const GoogleCallback = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get("code");

        if (code) {
          const response = await handleGoogleCallback(code);
          if (response && response.user) {
            setUser(response.user);
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        }
      } catch (error) {
        console.error("Google OAuth callback error:", error);
        setError(error.toString());
      }
    };

    handleCallback();
  }, [location, setUser]);

  if (error) {
    return <div>Authentication failed: {error}</div>;
  }

  return <Navigate to="/" replace />;
};

function App() {
  // Simulate auth state (replace with real auth later)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status when the app loads
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Use the getCurrentUser function from auth.js
        const response = await getCurrentUser();

        console.log("Authentication check response:", response);

        // Check if response contains user data and update the state and localStorage
        if (response) {
          console.log("User data:", response);
          setUser(response);
          localStorage.setItem("user", JSON.stringify(response));
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Clear any existing user data if authentication fails
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // You might want to show a loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          {/* Main landing page route */}
          <Route
            path="/"
            element={
              <main className="relative min-h-screen w-screen overflow-x-hidden">
                <NavBar />
                <Home />
                <Footer />
              </main>
            }
          />
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />

          {/* Google OAuth callback route */}
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Dynamic route for scene pages */}
          <Route path="/:sceneName" element={<ScenePage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
