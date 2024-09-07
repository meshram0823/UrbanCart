import { useSelector } from "react-redux";
import { selectFavouriteProduct } from "../../redux/features/favourites/favouriteSlice";
import Product from "./Product";

const Favourites = () => {
  const favourites = useSelector(selectFavouriteProduct);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem]">FAVOURITE PRODUCTS</h1>

      <div className="flex flex-wrap">
        {favourites.map((product) => (
          // Only render the product if it has a valid _id
          product._id && <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;
