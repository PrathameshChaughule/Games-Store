import { createContext, useEffect, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  return (
    <GameContext.Provider
      value={{ cartCount, updateCartCount }}
    >
      {children}
    </GameContext.Provider>
  );
};
