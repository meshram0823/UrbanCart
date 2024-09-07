import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "../../redux/features/favourites/favouriteSlice";
import Product from "./Product";

const Favourites = () => {
  // Fetch the favourites from the Redux store
  const favourites = useSelector(selectFavouriteProduct);

  if (!favourites || favourites.length === 0) {
    return <p className="ml-[10rem] text-lg font-bold ml-[3rem]">No favourite products found.</p>;
  }

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem]">FAVOURITE PRODUCTS</h1>

      <div className="flex flex-wrap">
        {favourites.map((product) => (
          // Only render the product if it has a valid _id
          product._id ? <Product key={product._id} product={product} /> : null
        ))}
      </div>
    </div>
  );
};

export default Favourites;
