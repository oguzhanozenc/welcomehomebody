import React from "react";
import Header from "./Header";
import Apparel from "./Apparel";
import Accessories from "./Accessories";
import Blog from "./Blog";
import Contact from "./Contact";

const Home = () => {
  return (
    <div>
      <Header />
      <Apparel />
      <Accessories />
      <Blog />
      <Contact />
    </div>
  );
};

export default Home;
