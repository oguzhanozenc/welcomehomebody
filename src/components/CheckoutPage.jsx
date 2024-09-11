import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import client from "../client";
import { toast } from "react-toastify";

export const useShopifyAccount = () => {
  const [accountUrl, setAccountUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch the Shopify store domain dynamically
  const fetchAccountUrl = async () => {
    const query = gql`
      query {
        shop {
          primaryDomain {
            url
          }
        }
      }
    `;

    try {
      const response = await client.request(query);
      const shopDomain = response.shop.primaryDomain.url;

      if (shopDomain) {
        const accountUrl = `${shopDomain}/account`; // Construct the account URL
        setAccountUrl(accountUrl);
        return accountUrl;
      } else {
        throw new Error("Account URL not found.");
      }
    } catch (error) {
      toast.error("Failed to retrieve account URL.");
      console.error("Error fetching Shopify account URL:", error);
      throw new Error("Account URL fetch failed.");
    }
  };

  // Handle redirection to the Shopify account page
  const handleAccountRedirect = async () => {
    setLoading(true);
    try {
      const url = await fetchAccountUrl();
      if (url) {
        window.location.href = url; // Redirect to the account page
      }
    } catch (error) {
      toast.error("Redirect to account failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAccountRedirect,
    loading,
  };
};

// Usage in the Account component
const Account = () => {
  const { handleAccountRedirect, loading } = useShopifyAccount();

  useEffect(() => {
    handleAccountRedirect(); // Automatically redirect on component mount
  }, [handleAccountRedirect]);

  return (
    <div>
      {loading ? <p>Redirecting to your account page...</p> : <p>Loading...</p>}
    </div>
  );
};

export default Account;
