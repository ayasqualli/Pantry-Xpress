"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");  // Changed to string

  useEffect(() => {
    document.title = 'Dashboard | Pantry Tracker';
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
      setItems(itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const addItem = async () => {
    if (newItem.trim() !== "" && user) {
      const docRef = await addDoc(collection(db, "pantry-items"), {
        name: newItem,
        uid: user.uid,
        category: selectedCategory,
        quantity: quantity,
        expirationDate: expirationDate  // Now a string
      });
      setItems([...items, { id: docRef.id, name: newItem, category: selectedCategory, quantity: quantity, expirationDate: expirationDate }]);
      setNewItem("");
      setQuantity(1);
      setExpirationDate("");
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "pantry-items", id));
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    if (searchTerm.trim() !== "" && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "" && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
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
        <Typography variant="h4">Pantry Dashboard</Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Search Items"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
          <MenuItem value="Grains">Grains</MenuItem>
          <MenuItem value="Meat-and-Seafood">Meat and Seafood</MenuItem>
          <MenuItem value="Beverages">Beverages</MenuItem>
          <MenuItem value="Snacks">Snacks</MenuItem>
          <MenuItem value="Frozen-Food">Frozen Food</MenuItem>
          <MenuItem value="Pantry-Staples">Pantry Staples</MenuItem>
          <MenuItem value="Bakery">Bakery</MenuItem>
          <MenuItem value="Household-items">Household Items</MenuItem>
        </Select>
      </FormControl>
      <TextField
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
        label="Quantity"
        type="number"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        label="Expiration Date"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        label="New Item"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={addItem} 
        disabled={!newItem.trim()}
        sx={{ mt: 2, mb: 2 }}
      >
        Add Item
      </Button>
      {filteredItems.length > 0 ? (
        <List>
          {filteredItems.map(item => (
            <ListItem key={item.id} 
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText 
                primary={item.name} 
                secondary={`Category: ${item.category} - Quantity: ${item.quantity} - Expiration: ${item.expirationDate || 'N/A'}`} 
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No items found.</Typography>
      )}
    </Box>
  );
};

export default Dashboard;