import React from "react";
import "../styles/Apparel.css";

const products = [
  {
    id: 1,
    name: "Arcade T-Shirt",
    price: "$19.99",
    image: "/product1.jpg",
  },
  {
    id: 2,
    name: "Pac-Man Tee",
    price: "$14.99",
    image: "/product2.jpg",
  },
  {
    id: 3,
    name: "Arcade Pants",
    price: "$9.99",
    image: "/pants.jpg",
  },
  {
    id: 3,
    name: "Retro T-Shirt",
    price: "$9.99",
    image: "/product3.jpg",
  },
];

export default function Apparel() {
  return (
    <div className="apparel" id="apparel">
      <h2 className="section-title">Apparel</h2>
      <div className="window">
        <div className="title-bar">
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
          <div className="title">Retro Arcade Apparel</div>
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
                  <button className="btn">VIEW</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
