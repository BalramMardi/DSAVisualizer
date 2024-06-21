import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { Helmet, HelmetProvider } from "react-helmet-async";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
        </Helmet>
        <Header />
        <main style={{ minHeight: "80vh" }}>{children}</main>
        {/* <Footer /> */}
      </HelmetProvider>
    </div>
  );
};

export default Layout;
