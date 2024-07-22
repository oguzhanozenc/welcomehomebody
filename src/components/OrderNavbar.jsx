import React from "react";
import { Link } from "react-router-dom";
import "../styles/OrderNavbar.css";
import { LiaWindowClose, LiaExpandArrowsAltSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";

const OrderNavbar = ({ basket, setBasket, isOpen, toggleNavbar }) => {
  const removeItem = (index) => {
    setBasket(basket.filter((_, i) => i !== index));
  };

  return (
    <div className={`order-navbar ${isOpen ? "open" : "closed"}`}>
      {isOpen && (
        <>
          <h2>Basket</h2>
          <ul>
            {basket.map((item, index) => (
              <li key={index}>
                <Link to={`/product/${item.id}`} className="basket-item-link">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="basket-item-image"
                  />
                  <span className="basket-item-name">{item.name}</span>
                  <span className="basket-item-price">{item.price}</span>
                </Link>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <Link to="/checkout" className="checkout-link">
            Go to Checkout
          </Link>
        </>
      )}
      <button className="toggle-btn" onClick={toggleNavbar}>
        {isOpen ? <LiaWindowClose /> : <LiaExpandArrowsAltSolid />}
      </button>
    </div>
  );
};

export default OrderNavbar;
