import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import client from "../client";
import { toast } from "react-toastify";
import "../styles/Account.css";

const Account = () => {
  const [accountUrl, setAccountUrl] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(false);
  const [buttonText, setButtonText] = useState("Enter Your Account");

  useEffect(() => {
    const fetchAccountUrl = async () => {
      try {
        const query = gql`
          query {
            shop {
              primaryDomain {
                url
              }
            }
          }
        `;
        const response = await client.request(query);
        const shopDomain = response.shop.primaryDomain.url;

        if (shopDomain) {
          const url = `${shopDomain}/account`;
          setAccountUrl(url);
        } else {
          throw new Error("Shopify account URL not found.");
        }
      } catch (error) {
        toast.error("Oops! Something went wrong. Please try again.");
        setError(true);
      }
    };

    fetchAccountUrl();
  }, []);

  const handleRedirect = () => {
    if (accountUrl) {
      setIsRedirecting(true);
      // Playful text changes
      setButtonText("Loading Inventory...");
      setTimeout(() => {
        setButtonText("Warping to Shopify...");
      }, 750);
      setTimeout(() => {
        window.location.href = accountUrl;
      }, 1000);
    }
  };

  const handleRetry = () => {
    setError(false);
    window.location.reload();
  };

  return (
    <div className="account-page">
      <div className="window account-window">
        <div className="account-title-bar">
          <div className="account-title">🎮 Account Access 🎮</div>
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
        </div>
        <div className="content">
          {!error ? (
            <div>
              <button
                onClick={handleRedirect}
                className={`redirect-button arcade-button ${
                  isRedirecting ? "redirecting" : ""
                }`}
                disabled={isRedirecting}
              >
                {isRedirecting ? buttonText : "Enter Your Account"}
              </button>
              {isRedirecting && <div className="spinner"></div>}
            </div>
          ) : (
            <div>
              <p className="arcade-text">❌ Connection Failed!</p>
              <button onClick={handleRetry} className="retry-button">
                Try Again!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
