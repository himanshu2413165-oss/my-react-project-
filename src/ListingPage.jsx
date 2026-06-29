import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "./CartContext";
import { money, StarRow, StockTag } from "./components";

/* ---------------------------------------------------------
   TASK 1 — LISTING PAGE
   Api 1: https://dummyjson.com/products?limit=194
--------------------------------------------------------- */

const LIST_URL = "https://dummyjson.com/products?limit=194";

export function ListingPage({ navigate }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetch(LIST_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products || []);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const visible = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating-desc") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, category, query, sort]);

  function handleQuickAdd(e, product) {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(product.id);
    window.clearTimeout(handleQuickAdd._t);
    handleQuickAdd._t = window.setTimeout(() => setJustAdded(null), 900);
  }

  return (
    <main className="page">
      <div className="catalog-head">
        <div>
          <p className="eyebrow">Full catalog</p>
          <h1 className="page-title">Every item, one ledger.</h1>
        </div>
        <p className="catalog-count">
          {status === "ready" ? `${visible.length} of ${products.length} items` : "\u00A0"}
        </p>
      </div>

      <div className="controls">
        <input
          className="search"
          type="text"
          placeholder="Search title or brand…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c.replace(/-/g, " ")}
            </option>
          ))}
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort: default</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Rating: best first</option>
        </select>
      </div>

      {status === "loading" && (
        <div className="grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="card skeleton" key={i}>
              <div className="thumb skeleton-block" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="empty-state">
          <p className="empty-title">Couldn't load the catalog.</p>
          <p className="empty-body">Check the connection and try again.</p>
        </div>
      )}

      {status === "ready" && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-title">No items match that search.</p>
          <p className="empty-body">Try a different keyword or category.</p>
        </div>
      )}

      {status === "ready" && visible.length > 0 && (
        <div className="grid">
          {visible.map((p) => (
            <article
              key={p.id}
              className="card"
              onClick={() => navigate({ name: "detail", id: p.id })}
            >
              <div className="thumb-wrap">
                <img className="thumb" src={p.thumbnail} alt={p.title} loading="lazy" />
                {p.discountPercentage > 0 && (
                  <span className="discount-flag">-{Math.round(p.discountPercentage)}%</span>
                )}
              </div>
              <div className="card-body">
                <p className="card-category">{p.category.replace(/-/g, " ")}</p>
                <h3 className="card-title">{p.title}</h3>
                <div className="card-meta">
                  <StarRow rating={p.rating} />
                  <StockTag stock={p.stock} />
                </div>
                <div className="card-foot">
                  <span className="price-mono">{money(p.price)}</span>
                  <button
                    className={`add-btn ${justAdded === p.id ? "added" : ""}`}
                    onClick={(e) => handleQuickAdd(e, p)}
                    disabled={p.stock === 0}
                  >
                    {justAdded === p.id ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
