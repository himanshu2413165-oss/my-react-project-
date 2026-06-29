import React from "react";
import { useCart } from "./CartContext";

/* ---------------------------------------------------------
   Shared helpers
--------------------------------------------------------- */

export function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

/* ---------------------------------------------------------
   Header — shown on every page, holds nav + cart count
--------------------------------------------------------- */

export function Header({ route, navigate }) {
  const { cartCount } = useCart();
  return (
    <header className="hdr">
      <div className="hdr-inner">
        <button className="brand" onClick={() => navigate({ name: "list" })}>
          <span className="brand-mark">LEDGER</span>
          <span className="brand-sub">&amp; co.</span>
        </button>

        <button
          className={`cart-btn ${route.name === "cart" ? "is-active" : ""}`}
          onClick={() => navigate({ name: "cart" })}
        >
          <span className="cart-btn-label">Cart</span>
          <span className="cart-btn-count">{String(cartCount).padStart(2, "0")}</span>
        </button>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   StarRow — rating display
--------------------------------------------------------- */

export function StarRow({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" aria-label={`Rated ${rating} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "star on" : "star"}>
          &#9733;
        </span>
      ))}
    </span>
  );
}

/* ---------------------------------------------------------
   StockTag — in stock / low stock / sold out
--------------------------------------------------------- */

export function StockTag({ stock }) {
  let label = "in stock";
  let cls = "ok";
  if (stock === 0) {
    label = "sold out";
    cls = "bad";
  } else if (stock < 10) {
    label = "low stock";
    cls = "warn";
  }
  return (
    <span className={`stock-tag ${cls}`}>
      {label} · {stock}
    </span>
  );
}
