
const express = require("express");
const Recipe = require("../models/Recipe");

const router = express.Router();

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

// GET one recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Invalid recipe ID" });
  }
});

// ADD a recipe
router.post("/", async (req, res) => {
  try {
    const { name, category, ingredients, steps, cookingTime } = req.body;

    if (
      !name?.trim() ||
      !category?.trim() ||
      !ingredients?.trim() ||
      !steps?.trim() ||
      cookingTime === "" ||
      cookingTime === undefined ||
      !Number.isFinite(Number(cookingTime)) ||
      Number(cookingTime) < 1
    ) {
      return res.status(400).json({
        message: "Fill in all fields and enter a valid cooking time"
      });
    }

    const recipe = await Recipe.create({
      name,
      category,
      ingredients,
      steps,
      cookingTime: Number(cookingTime)
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Failed to add recipe" });
  }
});

// UPDATE a recipe
router.put("/:id", async (req, res) => {
  try {
    const { name, category, ingredients, steps, cookingTime } = req.body;

    if (
      !name?.trim() ||
      !category?.trim() ||
      !ingredients?.trim() ||
      !steps?.trim() ||
      cookingTime === "" ||
      cookingTime === undefined ||
      !Number.isFinite(Number(cookingTime)) ||
      Number(cookingTime) < 1
    ) {
      return res.status(400).json({
        message: "Fill in all fields and enter a valid cooking time"
      });
    }

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        ingredients,
        steps,
        cookingTime: Number(cookingTime)
      },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: "Failed to update recipe" });
  }
});

// DELETE a recipe
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete recipe" });
  }
});

module.exports = router;
