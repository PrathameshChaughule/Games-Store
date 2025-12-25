import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Details from "./components/Details";
import Loading from "./components/Loading";
import Cart from "./components/Cart";

const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./pages/Home"));
const PS5 = lazy(() => import("./pages/PS5"));
const PS4 = lazy(() => import("./pages/PS4"));
const XBOX = lazy(() => import("./pages/XBOX"));

function App() {
  return (
    <div className="bg-[#111315] text-white h-fit w-[99vw]">
      <Router>
        <Suspense
          fallback={
            <div className="bg-black">
              <Loading />
            </div>
          }
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ps5Games" element={<PS5 />} />
            <Route path="/ps4Games" element={<PS4 />} />
            <Route path="/xboxGames" element={<XBOX />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <Footer />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
