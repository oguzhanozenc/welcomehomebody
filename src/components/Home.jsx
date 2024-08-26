import React from "react";
import Header from "./Header";
import About from "./About";
import ProductList from "./ProductList";
import RecentPosts from "./RecentPosts";
import Contact from "./Contact";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <About />
        <ProductList showRecent={true} />

        <RecentPosts />
        <Contact />
      </main>
    </>
  );
};

export default Home;
