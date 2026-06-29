import React, { useMemo } from "react";
import { useCart } from "./CartContext";
import { money } from "./components";

/* ---------------------------------------------------------
   TASK 3 — CART PAGE
   Displays every item added from Task 1 / Task 2, plus a
   full bill summary (subtotal, discount, shipping, tax, total).
--------------------------------------------------------- */

export function CartPage({ navigate }) {
  const { cartList, setQty, removeFromCart, clearCart } = useCart();

  const subtotal = useMemo(
    () => cartList.reduce((sum, it) => sum + it.product.price * it.qty, 0),
    [cartList]
  );
  const discountTotal = useMemo(
    () =>
      cartList.reduce((sum, it) => {
        const original =
          it.product.discountPercentage > 0
            ? it.product.price / (1 - it.product.discountPercentage / 100)
            : it.product.price;
        return sum + (original - it.product.price) * it.qty;
      }, 0),
    [cartList]
  );
  const shipping = cartList.length === 0 ? 0 : subtotal > 100 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartList.length === 0) {
    return (
      <main className="page">
        <div className="catalog-head">
          <div>
            <p className="eyebrow">Your cart</p>
            <h1 className="page-title">Nothing on the ledger yet.</h1>
          </div>
        </div>
        <div className="empty-state">
          <p className="empty-title">Your cart is empty.</p>
          <p className="empty-body">Browse the catalog and add something to it.</p>
          <button className="add-btn big" onClick={() => navigate({ name: "list" })}>
            Browse catalog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="catalog-head">
        <div>
          <p className="eyebrow">Your cart</p>
          <h1 className="page-title">Check the totals.</h1>
        </div>
        <button className="clear-link" onClick={clearCart}>
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-lines">
          <div className="ledger-head-row">
            <span>Item</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Total</span>
            <span aria-hidden="true"></span>
          </div>
          {cartList.map(({ product, qty }) => (
            <div className="cart-line" key={product.id}>
              <button
                className="cart-line-product"
                onClick={() => navigate({ name: "detail", id: product.id })}
              >
                <img src={product.thumbnail} alt={product.title} />
                <span>
                  <span className="cart-line-title">{product.title}</span>
                  <span className="cart-line-brand">{product.brand || product.category}</span>
                </span>
              </button>
              <span className="price-mono">{money(product.price)}</span>
              <div className="qty-stepper small">
                <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">
                  &minus;
                </button>
                <span className="qty-value">{qty}</span>
                <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <span className="price-mono">{money(product.price * qty)}</span>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(product.id)}
                aria-label={`Remove ${product.title}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <aside className="receipt">
          <p className="receipt-title">Bill summary</p>
          <div className="receipt-row">
            <span>Subtotal</span>
            <span className="mono">{money(subtotal)}</span>
          </div>
          {discountTotal > 0 && (
            <div className="receipt-row discount">
              <span>Discount savings</span>
              <span className="mono">&minus;{money(discountTotal)}</span>
            </div>
          )}
          <div className="receipt-row">
            <span>Shipping</span>
            <span className="mono">{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>
          <div className="receipt-row">
            <span>Estimated tax (8%)</span>
            <span className="mono">{money(tax)}</span>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-row total">
            <span>Total</span>
            <span className="mono">{money(total)}</span>
          </div>
          {shipping > 0 && (
            <p className="receipt-note">
              Add {money(100 - subtotal)} more for free shipping.
            </p>
          )}
          <button
            className="add-btn big full"
            onClick={() => window.alert("This is a demo — checkout isn't wired up.")}
          >
            Checkout
          </button>
          <button className="back-link center" onClick={() => navigate({ name: "list" })}>
            &larr; Continue browsing
          </button>
        </aside>
      </div>
    </main>
  );
}
