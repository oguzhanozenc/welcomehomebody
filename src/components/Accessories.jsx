import React from "react";
import "../styles/Accessories.css";

const products = [
  {
    id: 1,
    name: "Arcade Hat",
    price: "$19.99",
    image: "/hat.jpg",
  },
  {
    id: 2,
    name: "Keychain",
    price: "$14.99",
    image: "/keychain.jpg",
  },
  {
    id: 3,
    name: "Arcade Design Bag",
    price: "$9.99",
    image: "/bag.jpg",
  },
  {
    id: 4,
    name: "Arcade Design Wallet",
    price: "$9.99",
    image: "/wallet.jpg",
  },
];

export default function Accessories() {
  return (
    <div className="accessories" id="accessories">
      <h2 className="section-title">Accessories</h2>
      <div className="window">
        <div className="title-bar">
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
          <div className="title">Accessories</div>
        </div>
        <div className="content">
          <div className="products">
            {products.map((product) => (
              <div className="product" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <button className="btn">BAG IT</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
