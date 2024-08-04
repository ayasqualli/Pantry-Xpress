// Recipe generator

"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, CircularProgress, Divider } from '@mui/material';
import { db, auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const RecipeGenerator = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    document.title = 'Recipe Generator | Pantry Tracker';
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchItems(currentUser.uid);
      } else {
        setUser(null);
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchItems = async (uid) => {
    try {
      const q = query(collection(db, "pantry-items"), where("uid", "==", uid));
      const itemSnapshot = await getDocs(q);
      const fetchedItems = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched items:", fetchedItems); // Log fetched items
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleGenerateRecipes = async () => {
    setLoading(true);
    try {
      console.log("All items:", items); // Log all items
      // Filter out items with quantity 0
      const availableItems = items.filter(item => item.quantity > 0);
      console.log("Available items:", availableItems); // Log available items
      
      // Create an object with item names as keys and quantities as values
      const pantryInventory = availableItems.reduce((acc, item) => {
        acc[item.name.toLowerCase()] = item.quantity;
        return acc;
      }, {});
      console.log("Pantry inventory:", pantryInventory); // Log pantry inventory

      // Generate recipes based on pantry inventory
      const generatedRecipes = await generateRecipesFromItems(pantryInventory);
      console.log("Generated recipes:", generatedRecipes); // Log generated recipes

      setRecipes(generatedRecipes);
    } catch (error) {
      console.error("Error generating recipes:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const generateRecipesFromItems = async (pantryInventory) => {
    const ingredients = Object.keys(pantryInventory).join(',');
    console.log("Ingredients for API call:", ingredients);

    // Edamam API credentials
    const APP_ID = '7471abf2';
    const APP_KEY = '356c6a99a66109db82743f790ab96a04	';

    try {
      const response = await axios.get(`https://api.edamam.com/search`, {
        params: {
          q: ingredients,
          app_id: APP_ID,
          app_key: APP_KEY,
          from: 0,
          to: 5 // Number of recipes to return
        }
      });
      console.log("API response:", response.data);

      // Process and filter recipes
      return response.data.hits.map(hit => ({
        id: hit.recipe.uri,
        name: hit.recipe.label,
        image: hit.recipe.image,
        usedIngredients: hit.recipe.ingredientLines,
        url: hit.recipe.url
      }));
    } catch (error) {
      console.error("Error fetching recipes from API:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box mt={4} px={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Recipe Generator</Typography>
        <Button component={Link} href="/dashboard" variant="outlined">
          Back to Dashboard
        </Button>
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGenerateRecipes}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Generating...' : 'Generate Recipes'}
      </Button>

      {recipes.length > 0 ? (
        <List>
          {recipes.map((recipe, index) => (
            <React.Fragment key={recipe.id}>
              <ListItem alignItems="flex-start">
                <ListItemText 
                  primary={recipe.name} 
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        Ingredients: {recipe.usedIngredients.join(', ')}
                      </Typography>
                    </>
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  View Recipe
                </Button>
              </ListItem>
              {index < recipes.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2">
          {loading ? 'Generating recipes...' : 'No recipes generated yet. Click the button to generate recipes based on your pantry items.'}
        </Typography>
      )}
    </Box>
  );
};

export default RecipeGenerator;