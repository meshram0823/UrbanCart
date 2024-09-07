import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: {
    products: [],
  },
  reducers: {
    addToFavourites: (state, action) => {
      // Check if the product is already in favourites or not
      if (!state.products.some((product) => product._id === action.payload._id)) {
        state.products.push(action.payload);
      }
    },

    removeFromFavourites: (state, action) => {
      // Remove the product with the matching id
      state.products = state.products.filter((product) => product._id !== action.payload._id);
    },

    setFavourites: (state, action) => {
      // Set the favourites from the local storage
      state.products = action.payload;
    },
  },
});

export const { addToFavourites, removeFromFavourites, setFavourites } = favouriteSlice.actions;
export const selectFavouriteProduct = (state) => state.favourites.products;
export default favouriteSlice.reducer;
