import React from "react";
import Header from "./Header";
import About from "./About";
import FeaturedProducts from "./FeaturedProducts";
import RecentPosts from "./RecentPosts";
import Contact from "./Contact";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <FeaturedProducts />
        <RecentPosts />
        <Contact />
      </main>
    </>
  );
};

export default Home;
