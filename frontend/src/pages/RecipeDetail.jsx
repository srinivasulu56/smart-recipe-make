import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api";

function RecipeDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recipe = state?.recipe;
  const fromFavorites = state?.fromFavorites;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!recipe) {
    navigate("/");
    return null;
  }

  const saveFavorite = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to save favorites");
      return;
    }
    setSaving(true);
    try {
      await API.post("/favorites/save/", recipe);
      setSaved(true);
    } catch {
      alert("Failed to save");
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg)" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        position: "relative",
        height: "320px",
        background: "var(--bg2)",
        overflow: "hidden",
      }}>
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
            onError={e => { e.target.style.display = "none"; }}
          />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(15,14,12,0.95) 0%, rgba(15,14,12,0.4) 60%, transparent 100%)",
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute", top: "20px", left: "24px",
            background: "rgba(15,14,12,0.6)",
            border: "1px solid var(--border)",
            color: "var(--text2)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >← Back</button>

        {/* Title + meta */}
        <div style={{
          position: "absolute", bottom: "28px", left: "40px", right: "200px",
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "38px",
            color: "#fff",
            fontWeight: 700,
            marginBottom: "12px",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}>{recipe.title}</h1>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {recipe.time && (
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "5px" }}>
                ⏱ {recipe.time}
              </span>
            )}
            {recipe.servings && (
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "5px" }}>
                🍽 {recipe.servings} Servings
              </span>
            )}
            {recipe.cuisine && (
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: "5px" }}>
                🏷 {recipe.cuisine}
              </span>
            )}
          </div>
        </div>

        {/* Save button */}
        {!fromFavorites && (
          <button
            onClick={saveFavorite}
            disabled={saving || saved}
            style={{
              position: "absolute", bottom: "32px", right: "32px",
              background: saved ? "rgba(76,175,125,0.2)" : "rgba(232,160,69,0.15)",
              border: `1px solid ${saved ? "rgba(76,175,125,0.4)" : "rgba(232,160,69,0.4)"}`,
              color: saved ? "#4caf7d" : "var(--accent)",
              padding: "10px 22px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: saving || saved ? "default" : "pointer",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.2s",
            }}
          >
            {saved ? "✓ Saved" : saving ? "Saving..." : "❤ Save"}
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 32px",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "32px",
        alignItems: "start",
      }}>

        {/* Ingredients panel */}
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "24px",
          position: "sticky",
          top: "84px",
        }}>
          <h3 style={{
            fontSize: "18px",
            color: "var(--text)",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>🧂 Ingredients</h3>

          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0" }}>
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                padding: "10px 0",
                borderBottom: i < recipe.ingredients.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "7px", height: "7px",
                    background: "var(--accent)",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }} />
                  <span style={{ color: "var(--text)" }}>{ing}</span>
                </span>
                {recipe.quantities?.[i] && (
                  <span style={{ color: "var(--text3)", fontSize: "13px" }}>{recipe.quantities[i]}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 style={{
            fontSize: "18px",
            color: "var(--text)",
            marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>📋 Instructions</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recipe.steps?.map((step, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                animation: `fadeUp 0.3s ease ${i * 0.07}s both`,
              }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: "var(--accent-glow)",
                  border: "1px solid rgba(232,160,69,0.3)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)",
                  fontSize: "13px",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: "2px",
                }}>{i + 1}</div>

                <div style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  flex: 1,
                  fontSize: "14px",
                  color: "var(--text2)",
                  lineHeight: 1.7,
                }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default RecipeDetail;