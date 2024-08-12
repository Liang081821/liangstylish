import React from "react";
import GlobalStyle from "./styles/GlobalStyle.jsx";
import Homepage from "./components/Homepage";
import Checkout from "./components/Checkout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const getTotalQuantity = () => {
    const storedItems = JSON.parse(localStorage.getItem("CartItem")) || [];

    let totalQuantity = storedItems.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);

    return totalQuantity;
  };
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route
          path="/"
          element={<Homepage getTotalQuantity={getTotalQuantity} />}
        />
        <Route
          path="/product"
          element={<Homepage getTotalQuantity={getTotalQuantity} />}
        />
        <Route
          path="/checkout"
          element={<Checkout getTotalQuantity={getTotalQuantity} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
