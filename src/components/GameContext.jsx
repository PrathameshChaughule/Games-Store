import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:3000/games"),
      axios.get("http://localhost:3000/news"),
    ])
      .then(([gamesRes, newsRes]) => {
        setGames(gamesRes.data);
        setNews(newsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
      value={{ games, news, loading, cartCount, updateCartCount }}
    >
      {children}
    </GameContext.Provider>
  );
};
