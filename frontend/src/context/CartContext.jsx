import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
} from "../services/cartService";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    loading: false,
  });

  const { user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: "SET_CART", payload: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await getCartAPI();
      dispatch({ type: "SET_CART", payload: data.items || [] });
    } catch {
      dispatch({ type: "SET_CART", payload: [] });
    }
  };

 const addItem = async (product, qty = 1) => {
  try {
    const productId = product._id || product.product;
    const data = await addToCartAPI(productId, qty);
    dispatch({ type: "SET_CART", payload: data.items || [] });
  } catch (err) {
    console.error(err.response?.data?.message || "Failed to add item");
  }
};

  const removeItem = async (productId) => {
    try {
      const data = await removeFromCartAPI(productId);
      dispatch({ type: "SET_CART", payload: data.items || [] });
    } catch (err) {
      console.error("Failed to remove item");
    }
  };

  const updateQty = async (productId, qty) => {
    try {
      const data = await updateCartItemAPI(productId, qty);
      dispatch({ type: "SET_CART", payload: data.items || [] });
    } catch (err) {
      console.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      dispatch({ type: "SET_CART", payload: [] });
    } catch (err) {
      console.error("Failed to clear cart");
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleCart,
        fetchCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);