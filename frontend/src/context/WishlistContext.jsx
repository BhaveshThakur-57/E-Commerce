import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getWishlistAPI,
  toggleWishlistAPI,
  removeFromWishlistAPI,
} from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlistAPI();
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      await toggleWishlistAPI(productId);
      // Optimistic update
      const exists = wishlist.find((p) => p._id === productId);
      if (exists) {
        setWishlist((prev) => prev.filter((p) => p._id !== productId));
      } else {
        await fetchWishlist(); // Refetch to get full product data
      }
    } catch (err) {
      console.error("Wishlist toggle failed");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromWishlistAPI(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Remove wishlist failed");
    }
  };

  const isWishlisted = (productId) =>
    wishlist.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, toggleWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);