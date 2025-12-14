import React, { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const processOAuthCallback = (
  hash: string,
  navigateFunction: NavigateFunction
) => {
  // Remove # and decode URI components
  const fragment = hash.substring(1);
  console.log("Processing fragment:", fragment);

  const params = new URLSearchParams(fragment);

  const accessToken = params.get("access_token");
  const tokenType = params.get("token_type");
  const expiresIn = params.get("expires_in");

  console.log("OAuth callback received:", {
    accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    tokenType,
    expiresIn,
  });

  if (accessToken) {
    // Store the Google access token
    localStorage.setItem("google_access_token", accessToken);

    // Store a mock JWT token (in production, this would come from your backend)
    const mockToken = "mock_jwt_token_" + Date.now();
    localStorage.setItem("auth_token", mockToken);

    // Store token expiration
    if (expiresIn) {
      const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
      localStorage.setItem("token_expires", expirationTime.toString());
    }

    // Store mock user data for immediate authentication
    const mockUser = {
      id: "google_user_" + Date.now(),
      email: "user@gmail.com", // This would come from Google API
      name: "Google User", // This would come from Google API
      role: "user" as const,
      provider: "google" as const,
      isActive: true,
    };
    localStorage.setItem("google_user_data", JSON.stringify(mockUser));

    console.log("Authentication successful, navigating to dashboard...");
    // Force a page reload to ensure auth context picks up the new tokens
    window.location.href = "/dashboard";
  } else {
    console.error("No access token found in callback");
    navigateFunction("/");
  }
};

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    // Prevent re-processing if already done
    if (processed) return;

    // Debug: Log the full URL
    console.log("Full callback URL:", window.location.href);
    console.log("Hash fragment:", window.location.hash);

    // Handle Google OAuth response from URL fragment
    const hash = window.location.hash;
    if (!hash) {
      console.error("No hash fragment found in callback URL");
      // Wait a moment for the hash to potentially load
      setTimeout(() => {
        const retryHash = window.location.hash;
        console.log("Retry hash fragment:", retryHash);
        if (retryHash) {
          processOAuthCallback(retryHash, navigate);
        } else {
          navigate("/");
        }
      }, 100);
      return;
    }

    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setProcessed(true);
      processOAuthCallback(hash, navigate);
    }, 0);
  }, [navigate, processed]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
      }}
    >
      Authenticating...
    </div>
  );
};

export default AuthCallback;
