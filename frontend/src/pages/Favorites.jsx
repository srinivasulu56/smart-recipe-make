import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/favorites/");
      setFavorites(res.data);
    } catch {
      navigate("/login");
    }
    setLoading(false);
  };

  const deleteFavorite = async (e, id) => {
    e.stopPropagation();
    try {
      await API.delete(`/favorites/${id}/`);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", color: "var(--text)", display: "flex", alignItems: "center", gap: "12px" }}>
          ❤ My Favorites
          <span style={{
            background: "var(--accent-glow)",
            border: "1px solid rgba(232,160,69,0.3)",
            color: "var(--accent)",
            fontSize: "14px",
            padding: "3px 12px",
            borderRadius: "20px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}>{favorites.length}</span>
        </h2>
        <p style={{ color: "var(--text2)", marginTop: "6px" }}>Click a recipe to view details</p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🍽</div>
          <h3 style={{ color: "var(--text)", marginBottom: "8px" }}>No favorites yet</h3>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>Generate recipes and save the ones you love</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {favorites.map((recipe, i) => (
            <div
              key={recipe.id}
              onClick={() => navigate("/recipe", { state: { recipe, fromFavorites: true } })}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseOut={e => e.currentTarget.style.transform = "none"}
            >
              <div style={{ height: "150px", background: "var(--bg3)", overflow: "hidden" }}>
                <img src={recipe.image} alt={recipe.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </div>
              <div style={{ padding: "18px" }}>
                <h3 style={{ fontSize: "16px", color: "var(--text)", marginBottom: "10px" }}>{recipe.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "14px" }}>
                  <strong style={{ color: "var(--text3)" }}>Ingredients:</strong> {recipe.ingredients?.slice(0, 4).join(", ")}{recipe.ingredients?.length > 4 ? "..." : ""}
                </p>
                <button
                  onClick={(e) => deleteFavorite(e, recipe.id)}
                  style={{
                    width: "100%",
                    background: "rgba(224,92,92,0.08)",
                    border: "1px solid rgba(224,92,92,0.2)",
                    color: "var(--red)",
                    padding: "9px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseOver={e => { e.target.style.background = "rgba(224,92,92,0.15)"; }}
                  onMouseOut={e => { e.target.style.background = "rgba(224,92,92,0.08)"; }}
                >🗑 Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;