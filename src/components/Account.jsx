import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "graphql-request";
import client from "../client";
import { logoutCustomer } from "../actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login");
      return;
    }

    const query = gql`
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          addresses(first: 5) {
            edges {
              node {
                id
                address1
                address2
                city
                province
                country
                zip
              }
            }
          }
          orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
            edges {
              node {
                id
                orderNumber
                totalPriceV2 {
                  amount
                  currencyCode
                }
                processedAt
                lineItems(first: 5) {
                  edges {
                    node {
                      title
                      quantity
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      customerAccessToken: token,
    };

    client
      .request(query, variables)
      .then((response) => {
        setCustomerData(response.customer);
      })
      .catch((error) => {
        console.error("Failed to fetch customer data:", error);
        toast.error("Session expired. Please log in again.");
        dispatch(logoutCustomer());
        navigate("/login");
      });
  }, [isAuthenticated, token, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logoutCustomer());
    navigate("/");
  };

  if (!customerData) {
    return <p>Loading account information...</p>;
  }

  return (
    <div className="account-container">
      <h2>My Account</h2>
      <button onClick={handleLogout} className="btn logout-btn">
        Logout
      </button>
      <div className="account-details">
        <h3>Personal Information</h3>
        <p>
          Name: {customerData.firstName} {customerData.lastName}
        </p>
        <p>Email: {customerData.email}</p>
        {customerData.phone && <p>Phone: {customerData.phone}</p>}
      </div>
      <div className="account-orders">
        <h3>Order History</h3>
        {customerData.orders.edges.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          <ul className="orders-list">
            {customerData.orders.edges.map((orderEdge) => {
              const order = orderEdge.node;
              return (
                <li key={order.id} className="order-item">
                  <p>
                    <strong>Order #{order.orderNumber}</strong> -{" "}
                    {order.totalPriceV2.amount}{" "}
                    {order.totalPriceV2.currencyCode}
                  </p>
                  <p>
                    Placed on:{" "}
                    {new Date(order.processedAt).toLocaleDateString()}
                  </p>
                  <ul className="order-line-items">
                    {order.lineItems.edges.map((itemEdge) => (
                      <li key={itemEdge.node.title}>
                        {itemEdge.node.quantity} x {itemEdge.node.title}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Account;
