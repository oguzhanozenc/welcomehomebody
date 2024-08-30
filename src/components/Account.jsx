import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Account.css";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;
  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

  const handleLogin = async (e) => {
    e.preventDefault();

    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email,
        password,
      },
    };

    try {
      const response = await axios.post(
        `https://${shopifyDomain}/api/2023-07/graphql.json`,
        {
          query,
          variables,
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data.customerAccessTokenCreate;

      if (data.customerAccessToken) {
        setIsLoggedIn(true);
        setCustomer({
          ...customer,
          accessToken: data.customerAccessToken.accessToken,
        });
        fetchCustomerDetails(data.customerAccessToken.accessToken);
      } else {
        setError(data.customerUserErrors[0].message);
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    }
  };

  const fetchCustomerDetails = async (accessToken) => {
    const query = `
      query {
        customer(customerAccessToken: "${accessToken}") {
          id
          firstName
          lastName
          email
          orders(first: 10) {
            edges {
              node {
                name
                processedAt
                statusUrl
                totalPriceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
          addresses {
            id
            address1
            address2
            city
            country
            zip
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        `https://${shopifyDomain}/api/2023-07/graphql.json`,
        { query },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data.customer;
      setCustomer(data);
      setOrders(data.orders.edges.map((edge) => edge.node));
      setAddresses(data.addresses);
    } catch (err) {
      setError("An error occurred while fetching customer details.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const query = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        firstName,
        lastName,
        email,
        password,
      },
    };

    try {
      const response = await axios.post(
        `https://${shopifyDomain}/api/2023-07/graphql.json`,
        {
          query,
          variables,
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data.customerCreate;

      if (data.customer) {
        setIsLoggedIn(true);
        setCustomer(data.customer);
      } else {
        setError(data.customerUserErrors[0].message);
      }
    } catch (err) {
      setError("An error occurred while signing up.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const query = `
      mutation customerUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        id: customer.id,
        firstName,
        lastName,
        email,
        password,
      },
    };

    try {
      const response = await axios.post(
        `https://${shopifyDomain}/api/2023-07/graphql.json`,
        {
          query,
          variables,
        },
        {
          headers: {
            "X-Shopify-Storefront-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data.customerUpdate;

      if (data.customer) {
        setCustomer(data.customer);
        alert("Profile updated successfully");
      } else {
        setError(data.customerUserErrors[0].message);
      }
    } catch (err) {
      setError("An error occurred while updating the profile.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCustomer(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setOrders([]);
    setAddresses([]);
  };

  return (
    <div className="account-container">
      <h2>{isLoggedIn ? "Account Details" : isSignup ? "Sign Up" : "Login"}</h2>
      {error && <p className="error-message">{error}</p>}

      {!isLoggedIn ? (
        <>
          <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="account-form"
          >
            {isSignup && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
          </form>
          <p>
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="toggle-button"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="toggle-button"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </>
      ) : (
        <div className="account-details">
          <h2>
            Welcome, {customer.firstName} {customer.lastName}
          </h2>
          <p>Email: {customer.email}</p>
          <h3>Your Orders</h3>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ul className="order-list">
              {orders.map((order, index) => (
                <li key={index}>
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order #{order.name} - {order.totalPriceV2.amount}{" "}
                    {order.totalPriceV2.currencyCode}
                    <br />
                    Processed on{" "}
                    {new Date(order.processedAt).toLocaleDateString()}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <h3>Addresses</h3>
          {addresses.length === 0 ? (
            <p>No addresses found.</p>
          ) : (
            <ul className="address-list">
              {addresses.map((address, index) => (
                <li key={index}>
                  {address.address1}, {address.city}, {address.country},{" "}
                  {address.zip}
                  <br />
                  {address.address2 && <span>{address.address2}</span>}
                </li>
              ))}
            </ul>
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Account;
