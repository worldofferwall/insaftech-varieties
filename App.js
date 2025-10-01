import React, { useEffect, useState } from "react";

export default function InsafTechSite() {
  const BRAND = {
    name: "Insaf Tech & Varieties",
    color: "#2B7FFF",
    accent: "#0B66FF",
  };

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem("insaf_bookmarks_v1");
      return raw ? JSON.parse(raw) : sampleBookmarks();
    } catch (e) {
      return sampleBookmarks();
    }
  });
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", tags: "" });

  useEffect(() => {
    localStorage.setItem("insaf_bookmarks_v1", JSON.stringify(bookmarks));
  }, [bookmarks]);

  function sampleBookmarks() {
    return [
      {
        id: cryptoRandomId(),
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        tags: ["dev", "docs"],
        notes: "Browser and JS docs",
      },
      {
        id: cryptoRandomId(),
        title: "Stack Overflow",
        url: "https://stackoverflow.com/",
        tags: ["community", "qa"],
        notes: "Q&A for programmers",
      },
    ];
  }

  function cryptoRandomId() {
    return Math.random().toString(36).slice(2, 9);
  }

  function addBookmark(e) {
    e.preventDefault();
    if (!form.title || !form.url) return;
    const newBm = {
      id: cryptoRandomId(),
      title: form.title,
      url: form.url.startsWith("http") ? form.url : `https://${form.url}`,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      notes: "",
    };
    setBookmarks((s) => [newBm, ...s]);
    setForm({ title: "", url: "", tags: "" });
    setShowForm(false);
  }

  function removeBookmark(id) {
    if (!confirm("Remove this bookmark?")) return;
    setBookmarks((s) => s.filter((b) => b.id !== id));
  }

  function toggleFavorite(id) {
    setBookmarks((s) =>
      s.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b))
    );
  }

  const filtered = bookmarks.filter((b) => {
    const q = query.toLowerCase();
    return (
      !q ||
      b.title.toLowerCase().includes(q) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (b.url || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold"
                style={{ background: BRAND.color }}
              >
                IT
              </div>
              <div>
                <h1 className="text-lg font-semibold">{BRAND.name}</h1>
                <p className="text-xs text-gray-500">Bookmarking tech service</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="py-2 px-3 rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm shadow-sm"
              >
                + Add Bookmark
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-4">Your bookmarks</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, tag, or URL"
          className="border rounded-md px-3 py-2 w-64 text-sm mb-6"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No bookmarks found.</div>
          ) : (
            filtered.map((b) => (
              <article
                key={b.id}
                className="border rounded-md p-3 hover:shadow-md bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline"
                    >
                      {b.title}
                    </a>
                    <div className="text-xs text-gray-500">{b.url}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleFavorite(b.id)}
                      className="text-sm"
                    >
                      {b.favorite ? "★" : "☆"}
                    </button>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      className="text-xs text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
