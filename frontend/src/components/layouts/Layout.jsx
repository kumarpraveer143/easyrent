import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../UI/Navbar";
import Footer from "../UI/Footer";

/**
 * The skip link lives here so every page gets one. Page.jsx renders the
 * matching <main id="main">, so tabbing once from the top of any screen
 * jumps straight past the navigation.
 */
const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface-sunken">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
