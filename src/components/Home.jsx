import React from "react";
import Header from "./Header";
import About from "./About";
import ProductList from "./ProductList";
import RecentPosts from "./RecentPosts";
import Contact from "./Contact";
import { products } from "./ProductData";

const Home = ({ addToBasket }) => {
  return (
    <div>
      <Header />
      <About />
      <ProductList
        title="Apparel"
        products={products.apparel}
        addToBasket={addToBasket}
      />
      <ProductList
        title="Accessories"
        products={products.accessories}
        addToBasket={addToBasket}
      />
      <RecentPosts />
      <Contact />
    </div>
  );
};

export default Home;
