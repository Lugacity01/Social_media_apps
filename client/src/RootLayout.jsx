import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import Widgets from "./components/Widgets";
import ThemeModal from "./components/ThemeModal";
import { useSelector } from "react-redux";

function RootLayout() {
  const { themeModalIsOpen } = useSelector((state) => state?.ui);
  const { primaryColor, backgroundColor } = useSelector(
    (state) => state?.ui?.theme
  );

  useEffect(() => {
    const body = document.body;
    body.className = `${primaryColor} ${backgroundColor}`;
  }, [primaryColor, backgroundColor]);

  return (
    <>
      <NavBar />
      <main className="main">
        <div className="container main__container">
          <Sidebar />
          <Outlet />
          <Widgets />
          {themeModalIsOpen && <ThemeModal />}
        </div>
      </main>
    </>
  );
}

export default RootLayout;
