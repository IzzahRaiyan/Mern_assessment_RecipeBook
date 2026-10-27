
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = `${import.meta.env.VITE_API_URL}/recipes`;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    ingredients: "",
    steps: "",
    cookingTime: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadRecipes() {
    try {
      const response = await axios.get(API);
      setRecipes(response.data);
    } catch (error) {
      setMessage("Could not load recipes. Check the backend.");
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        setMessage("Recipe updated successfully!");
      } else {
        await axios.post(API, form);
        setMessage("Recipe added successfully!");
      }

      setForm({
        name: "",
        category: "",
        ingredients: "",
        steps: "",
        cookingTime: ""
      });
      setEditingId(null);
      loadRecipes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  }

  function editRecipe(recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: recipe.cookingTime
    });
    setEditingId(recipe._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      setMessage("Recipe deleted successfully!");
      loadRecipes();
    } catch (error) {
      setMessage("Could not delete the recipe.");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      name: "",
      category: "",
      ingredients: "",
      steps: "",
      cookingTime: ""
    });
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🍲 Recipe Book</h1>
        <p>Save your favourite recipes in one place</p>
      </header>

      <main className="container">
        <section className="form-section">
          <h2>{editingId ? "Edit Recipe" : "Add a New Recipe"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Recipe name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="category"
              placeholder="Category (Breakfast, Lunch...)"
              value={form.category}
              onChange={handleChange}
              required
            />

            <textarea
              name="ingredients"
              placeholder="Ingredients"
              value={form.ingredients}
              onChange={handleChange}
              required
            />

            <textarea
              name="steps"
              placeholder="Cooking instructions"
              value={form.steps}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="cookingTime"
              placeholder="Cooking time in minutes"
              min="1"
              value={form.cookingTime}
              onChange={handleChange}
              required
            />

            <button type="submit">
              {editingId ? "Update Recipe" : "Add Recipe"}
            </button>

            {editingId && (
              <button type="button" className="cancel" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="recipes-section">
          <h2>My Recipes ({recipes.length})</h2>

          {recipes.length === 0 ? (
            <p>No recipes yet. Add your first recipe above!</p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <article className="recipe-card" key={recipe._id}>
                  <span className="category">{recipe.category}</span>
                  <h3>{recipe.name}</h3>
                  <p><strong>Cooking time:</strong> {recipe.cookingTime} minutes</p>
                  <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p><strong>Instructions:</strong> {recipe.steps}</p>

                  <div className="actions">
                    <button onClick={() => editRecipe(recipe)}>Edit</button>
                    <button
                      className="delete"
                      onClick={() => deleteRecipe(recipe._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
