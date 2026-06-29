import React, { useState, useCallback } from "react";
import { CartProvider } from "./CartContext";
import { Header } from "./components";
import { ListingPage } from "./ListingPage";   // Task 1
import { ProductPage } from "./ProductPage";   // Task 2
import { CartPage } from "./CartPage";         // Task 3
import "./styles.css";

/* ---------------------------------------------------------
   APP SHELL + ROUTER
   Simple state-based router (no react-router dependency).
   route.name: "list" | "detail" | "cart"
--------------------------------------------------------- */

export default function ShopApp() {
  const [route, setRoute] = useState({ name: "list" });

  const navigate = useCallback((next) => {
    setRoute(next);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, []);

  return (
    <CartProvider>
      <div className="shop-root">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap"
        />
        <Header route={route} navigate={navigate} />

        {route.name === "list" && <ListingPage navigate={navigate} />}
        {route.name === "detail" && <ProductPage id={route.id} navigate={navigate} />}
        {route.name === "cart" && <CartPage navigate={navigate} />}
      </div>
    </CartProvider>
  );
}
