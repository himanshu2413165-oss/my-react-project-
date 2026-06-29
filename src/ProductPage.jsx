import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { money, StarRow, StockTag } from "./components";

/* ---------------------------------------------------------
   TASK 2 — PRODUCT DETAIL PAGE
   Api 2: https://dummyjson.com/products/:id
   Shown after clicking a product on the Listing page.
--------------------------------------------------------- */

const DETAIL_URL = (id) => `https://dummyjson.com/products/${id}`;

export function ProductPage({ id, navigate }) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setActiveImg(0);
    setQty(1);
    setAdded(false);
    fetch(DETAIL_URL(id))
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <main className="page">
        <button className="back-link" onClick={() => navigate({ name: "list" })}>
          &larr; Back to catalog
        </button>
        <div className="detail-skeleton">
          <div className="skeleton-block tall" />
          <div className="detail-skeleton-text">
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </main>
    );
  }

  if (status === "error" || !product) {
    return (
      <main className="page">
        <button className="back-link" onClick={() => navigate({ name: "list" })}>
          &larr; Back to catalog
        </button>
        <div className="empty-state">
          <p className="empty-title">Couldn't load this product.</p>
          <p className="empty-body">It may not exist, or the connection dropped.</p>
        </div>
      </main>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.thumbnail];
  const discounted = product.discountPercentage > 0;
  const original = discounted
    ? product.price / (1 - product.discountPercentage / 100)
    : product.price;

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <main className="page">
      <button className="back-link" onClick={() => navigate({ name: "list" })}>
        &larr; Back to catalog
      </button>

      <div className="detail">
        <div className="detail-gallery">
          <div className="detail-main-img">
            <img src={images[activeImg]} alt={product.title} />
          </div>
          {images.length > 1 && (
            <div className="thumb-strip">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumb-pip ${i === activeImg ? "is-active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="eyebrow">{product.brand || product.category}</p>
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-meta-row">
            <StarRow rating={product.rating} />
            <span className="meta-divider">·</span>
            <StockTag stock={product.stock} />
          </div>

          <div className="price-block">
            <span className="price-mono big">{money(product.price)}</span>
            {discounted && (
              <>
                <span className="price-strike">{money(original)}</span>
                <span className="discount-flag inline">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <dl className="spec-list">
            <div className="spec-row">
              <dt>Category</dt>
              <dd>{product.category.replace(/-/g, " ")}</dd>
            </div>
            {product.sku && (
              <div className="spec-row">
                <dt>SKU</dt>
                <dd className="mono">{product.sku}</dd>
              </div>
            )}
            {product.warrantyInformation && (
              <div className="spec-row">
                <dt>Warranty</dt>
                <dd>{product.warrantyInformation}</dd>
              </div>
            )}
            {product.shippingInformation && (
              <div className="spec-row">
                <dt>Shipping</dt>
                <dd>{product.shippingInformation}</dd>
              </div>
            )}
            {product.returnPolicy && (
              <div className="spec-row">
                <dt>Returns</dt>
                <dd>{product.returnPolicy}</dd>
              </div>
            )}
          </dl>

          <div className="qty-row">
            <span className="qty-label">Quantity</span>
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                &minus;
              </button>
              <span className="qty-value">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            className={`add-btn big ${added ? "added" : ""}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Sold out" : added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </main>
  );
}
