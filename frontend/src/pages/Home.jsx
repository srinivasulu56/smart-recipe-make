import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const COMMON = ["Salt", "Pepper", "Oil", "Water", "Sugar", "Onion", "Garlic",
  "Tomato", "Milk", "Egg", "Bread", "Chicken", "Butter", "Cheese", "Lemon", "Ginger", "Chili"];

function Home() {
  const [input, setInput] = useState("");
  const [pantry, setPantry] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState({});
  const inputRef = useRef();
  const navigate = useNavigate();

  const addIngredient = (item) => {
    const val = item || input.trim();
    if (!val) return;
    const lower = val.toLowerCase();
    if (!pantry.find(p => p.toLowerCase() === lower)) {
      setPantry([...pantry, val]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const removeIngredient = (item) => {
    setPantry(pantry.filter(p => p !== item));
  };

  const search = async () => {
    if (pantry.length === 0) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await API.post("/recipes/search/", { ingredients: pantry });
      setRecipes(res.data);
    } catch {
      alert("Failed to generate recipes");
    }
    setLoading(false);
  };

  const saveFavorite = async (e, recipe, i) => {
    e.stopPropagation();
    if (!localStorage.getItem("token")) {
      alert("Please login to save favorites");
      return;
    }
    setSaving(i);
    try {
      await API.post("/favorites/save/", recipe);
      setSaved(prev => ({ ...prev, [i]: true }));
    } catch {
      alert("Failed to save");
    }
    setSaving(null);
  };

  const matchPercent = (recipe) => {
    if (!recipe.ingredients) return 0;
    const matched = recipe.ingredients.filter(ing =>
      pantry.some(p => ing.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(ing.toLowerCase()))
    );
    return Math.round((matched.length / recipe.ingredients.length) * 100);
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "300px",
        minWidth: "300px",
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        padding: "28px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div>
          <h3 style={{ fontSize: "16px", color: "var(--text)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            🛒 Your Pantry
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text3)" }}>Add what you have</p>
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addIngredient()}
            placeholder="Add ingredient..."
            style={{
              flex: 1,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "10px 14px",
              color: "var(--text)",
              fontSize: "13px",
              outline: "none",
            }}
          />
          <button onClick={() => addIngredient()} style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "10px",
            width: "38px",
            height: "38px",
            fontSize: "18px",
            color: "#0f0e0c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>+</button>
        </div>

        {/* Pantry Tags */}
        {pantry.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {pantry.map(item => (
              <span key={item} style={{
                background: "var(--accent-glow)",
                border: "1px solid rgba(232,160,69,0.3)",
                color: "var(--accent)",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                {item}
                <button onClick={() => removeIngredient(item)} style={{
                  background: "none", border: "none",
                  color: "var(--accent)", fontSize: "14px", padding: 0, lineHeight: 1,
                }}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Common Items */}
        <div>
          <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Common Items</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {COMMON.map(item => {
              const inPantry = pantry.find(p => p.toLowerCase() === item.toLowerCase());
              return (
                <button key={item} onClick={() => inPantry ? removeIngredient(inPantry) : addIngredient(item)} style={{
                  background: inPantry ? "var(--accent-glow)" : "var(--bg3)",
                  border: `1px solid ${inPantry ? "rgba(232,160,69,0.4)" : "var(--border)"}`,
                  color: inPantry ? "var(--accent)" : "var(--text2)",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  transition: "all 0.15s",
                }}>
                  {item}{inPantry ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {pantry.length > 0 && (
          <button onClick={() => setPantry([])} style={{
            background: "none", border: "none",
            color: "var(--text3)", fontSize: "12px", textAlign: "left",
            textDecoration: "underline",
          }}>Clear Pantry</button>
        )}

        {/* Generate Button */}
        <button onClick={search} disabled={loading || pantry.length === 0} style={{
          background: pantry.length === 0 ? "var(--bg3)" : "var(--accent)",
          color: pantry.length === 0 ? "var(--text3)" : "#0f0e0c",
          border: "none",
          borderRadius: "12px",
          padding: "14px",
          fontSize: "14px",
          fontWeight: 600,
          marginTop: "auto",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          {loading ? (
            <>
              <span style={{ width: "14px", height: "14px", border: "2px solid #0f0e0c", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }}></span>
              Generating...
            </>
          ) : "🍽 Generate Recipes"}
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {!searched && (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>🥘</div>
            <h2 style={{ fontSize: "32px", color: "var(--text)", marginBottom: "12px" }}>What's in your pantry?</h2>
            <p style={{ color: "var(--text2)", fontSize: "16px" }}>Add ingredients on the left and we'll find the perfect recipes</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }}></div>
            <p style={{ color: "var(--text2)" }}>AI is crafting your recipes...</p>
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <>
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "26px", color: "var(--text)" }}>Found {recipes.length} Recipes for you</h2>
              <p style={{ color: "var(--text2)", fontSize: "14px", marginTop: "4px" }}>Click a recipe to view details</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {recipes.map((recipe, i) => {
                const match = matchPercent(recipe);
                return (
                  <div
                    key={i}
                    onClick={() => navigate("/recipe", { state: { recipe, index: i } })}
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
                      cursor: "pointer",
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                    onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Image */}
                    <div style={{ height: "160px", background: "var(--bg3)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={recipe.image} alt={recipe.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                      <div style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: match === 100 ? "var(--green)" : match >= 50 ? "var(--accent)" : "var(--bg2)",
                        color: match === 100 || match >= 50 ? "#0f0e0c" : "var(--text2)",
                        padding: "4px 10px", borderRadius: "20px",
                        fontSize: "11px", fontWeight: 700,
                      }}>{match}% Match</div>
                    </div>

                    <div style={{ padding: "18px" }}>
                      <h3 style={{ fontSize: "17px", color: "var(--text)", marginBottom: "8px" }}>{recipe.title}</h3>

                      {match === 100 && (
                        <p style={{ fontSize: "12px", color: "var(--green)", marginBottom: "10px" }}>✨ You have all ingredients!</p>
                      )}

                      <p style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "14px" }}>
                        <strong style={{ color: "var(--text3)" }}>Ingredients:</strong> {recipe.ingredients?.slice(0, 4).join(", ")}{recipe.ingredients?.length > 4 ? "..." : ""}
                      </p>

                      <button
                        onClick={(e) => saveFavorite(e, recipe, i)}
                        disabled={saving === i || saved[i]}
                        style={{
                          width: "100%",
                          background: saved[i] ? "rgba(76,175,125,0.15)" : "var(--accent-glow)",
                          border: `1px solid ${saved[i] ? "rgba(76,175,125,0.3)" : "rgba(232,160,69,0.3)"}`,
                          color: saved[i] ? "var(--green)" : "var(--accent)",
                          padding: "10px",
                          borderRadius: "10px",
                          fontSize: "13px",
                          fontWeight: 500,
                          transition: "all 0.2s",
                          cursor: saving === i || saved[i] ? "default" : "pointer",
                        }}
                      >
                        {saved[i] ? "✓ Saved" : saving === i ? "Saving..." : "❤ Save Recipe"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;