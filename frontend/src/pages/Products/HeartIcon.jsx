import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  setFavourites,
} from "../../redux/features/favourites/favouriteSlice";

import {
  addFavouritesToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouritesFromLocalStoraged,
} from "../../utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  const isFavourites = favourites.some((p) => p._id == product._id);

  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, [dispatch]);

  const toogleFavourites = () => {
    if (isFavourites) {
      dispatch(removeFromFavourites(product));
      // remove the fav from the local storage as well
      removeFavouritesFromLocalStoraged(product._id);
    } else {
      dispatch(addToFavourites(product));
      // add the product to local storage as well
      addFavouritesToLocalStorage(product);
    }
  };

  return (
    <div
      onClick={toogleFavourites}
      className="absolute top-2 right-5 cursor-pointer transition-transform transform hover:scale-110"
    >
      {isFavourites ? (
        <FaHeart className="text-pink-500 hover:text-pink-400 transition-colors" />
      ) : (
        <FaRegHeart className="text-white hover:text-pink-500 transition-colors" />
      )}
    </div>
  );
};

export default HeartIcon;
